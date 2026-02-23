import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.FINANCE_TABLE;

/**
 * 支出修正 Lambda Handler
 * - 支出明細（EXP）を修正
 * - 月別集計（MONTH）を修正（月は変わらない前提）
 * - カテゴリ別集計（CAT）を修正
 *
 * パスパラメータ: expenseId
 * リクエストBody:
 * {
 *   "date": "2025-01-15",   // 月は変更不可（フロントで制御）
 *   "category": "食費",
 *   "title": "ランチ代",
 *   "amount": 1500
 * }
 */
export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };

  const httpMethod = event.requestContext?.http?.method;

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: { code: 'METHOD_NOT_ALLOWED', message: 'PUT method required' } }),
    };
  }

  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }),
    };
  }

  const expenseId = event.pathParameters?.expenseId;
  if (!expenseId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'expenseId path parameter is required' } }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }),
    };
  }

  // date は月変更不可のためSK・occurredAt更新には使用しない
  const { category, title, amount } = body;

  if (!category || !title || amount === undefined) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: [
            ...(!category ? [{ field: 'category', reason: 'required' }] : []),
            ...(!title ? [{ field: 'title', reason: 'required' }] : []),
            ...(amount === undefined ? [{ field: 'amount', reason: 'required' }] : []),
          ],
        },
      }),
    };
  }

  if (typeof amount !== 'number') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: 'amount must be a number' },
      }),
    };
  }

  const pk = `USER#${userId}`;

  // 既存の支出明細を取得（expenseId属性で絞り込み）
  let oldItem;
  try {
    const result = await ddbDocClient.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        FilterExpression: 'expenseId = :expenseId',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':skPrefix': 'EXP#',
          ':expenseId': expenseId,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: { code: 'NOT_FOUND', message: 'Expense not found' } }),
      };
    }

    oldItem = result.Items[0];
  } catch (error) {
    console.error('Error fetching expense:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch expense' } }),
    };
  }

  const now = new Date().toISOString();
  const oldCategory = oldItem.category;
  const oldAmount = oldItem.amount;
  const yearMonth = oldItem.yearMonth;

  const monthSK = `MONTH#${yearMonth}`;
  const oldCatSK = `CAT#${yearMonth}#${oldCategory}`;
  const newCatSK = `CAT#${yearMonth}#${category}`;
  const isSameCategory = oldCategory === category;

  const transactItems = [
    // 1. 支出明細を更新（SKはそのまま・月変更なし前提）
    {
      Update: {
        TableName: tableName,
        Key: { PK: pk, SK: oldItem.SK },
        UpdateExpression: 'SET category = :cat, note = :note, amount = :amount, updatedAt = :now',
        ExpressionAttributeValues: {
          ':cat': category,
          ':note': title,
          ':amount': amount,
          ':now': now,
        },
      },
    },
    // 2. 月別集計を差分更新
    {
      Update: {
        TableName: tableName,
        Key: { PK: pk, SK: monthSK },
        UpdateExpression: `
          SET expenseTotal = if_not_exists(expenseTotal, :zero) + :delta,
              updatedAt = :now
        `,
        ExpressionAttributeValues: {
          ':delta': amount - oldAmount,
          ':zero': 0,
          ':now': now,
        },
      },
    },
  ];

  // 3. カテゴリ別集計の更新
  if (isSameCategory) {
    // 同カテゴリ → 差分更新
    transactItems.push({
      Update: {
        TableName: tableName,
        Key: { PK: pk, SK: newCatSK },
        UpdateExpression: `
          SET totalAmount = if_not_exists(totalAmount, :zero) + :delta,
              updatedAt = :now
        `,
        ExpressionAttributeValues: {
          ':delta': amount - oldAmount,
          ':zero': 0,
          ':now': now,
        },
      },
    });
  } else {
    // カテゴリ変更 → 旧から減算、新に加算
    transactItems.push(
      {
        Update: {
          TableName: tableName,
          Key: { PK: pk, SK: oldCatSK },
          UpdateExpression: `
            SET totalAmount = if_not_exists(totalAmount, :zero) - :oldAmount,
                updatedAt = :now
          `,
          ExpressionAttributeValues: {
            ':oldAmount': oldAmount,
            ':zero': 0,
            ':now': now,
          },
        },
      },
      {
        Update: {
          TableName: tableName,
          Key: { PK: pk, SK: newCatSK },
          UpdateExpression: `
            SET yearMonth = :ym,
                category = :cat,
                totalAmount = if_not_exists(totalAmount, :zero) + :amount,
                updatedAt = :now
          `,
          ExpressionAttributeValues: {
            ':ym': yearMonth,
            ':cat': category,
            ':amount': amount,
            ':zero': 0,
            ':now': now,
          },
        },
      }
    );
  }

  try {
    await ddbDocClient.send(new TransactWriteCommand({ TransactItems: transactItems }));
    return { statusCode: 204, headers, body: '' };
  } catch (error) {
    console.error('Error updating expense:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: 'Failed to update expense' } }),
    };
  }
};
