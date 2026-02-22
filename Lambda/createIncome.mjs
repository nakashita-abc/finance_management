import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.FINANCE_TABLE;

/**
 * 収入登録 Lambda Handler
 * - 収入明細（INC）を登録
 * - 月別集計（MONTH）を更新（incomeTotal += amount）
 *
 * リクエストBody:
 * {
 *   "occurredAt": "2025-01-25T00:00:00.000Z",
 *   "category": "給与",           // DB上は source として保存
 *   "amount": 300000,
 *   "memo": "3月分給与"            // optional、DB上は note として保存
 * }
 */
export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };

  // HTTP API v2 のメソッド取得
  const httpMethod = event.requestContext?.http?.method;

  // Preflight request
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST method required' } }),
    };
  }

  // Cognito認証からuserIdを取得（HTTP API v2 の JWT Authorizer）
  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }),
    };
  }

  // リクエストBodyをパース
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

  // バリデーション
  const { occurredAt, category, amount, memo } = body;

  if (!occurredAt || !category || amount === undefined) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: [
            ...(!occurredAt ? [{ field: 'occurredAt', reason: 'required' }] : []),
            ...(!category ? [{ field: 'category', reason: 'required' }] : []),
            ...(amount === undefined ? [{ field: 'amount', reason: 'required' }] : []),
          ],
        },
      }),
    };
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: 'amount must be a positive number' },
      }),
    };
  }

  // ID・日時の生成
  const incomeId = randomUUID();
  const now = new Date().toISOString();
  const yearMonth = occurredAt.substring(0, 7); // "2025-01"

  // キー設計（DB設計書に準拠）
  const pk = `USER#${userId}`;
  const incomeSK = `INC#${yearMonth}#${occurredAt}#${incomeId}`;
  const monthSK = `MONTH#${yearMonth}`;

  try {
    // TransactWriteで2つのアイテムを同時更新
    await ddbDocClient.send(
      new TransactWriteCommand({
        TransactItems: [
          // 1. 収入明細を登録
          {
            Put: {
              TableName: tableName,
              Item: {
                PK: pk,
                SK: incomeSK,
                incomeId,
                occurredAt,
                yearMonth,
                source: category,
                amount,
                note: memo || null,
                createdAt: now,
                updatedAt: now,
              },
            },
          },
          // 2. 月別集計を更新（incomeTotal += amount）
          {
            Update: {
              TableName: tableName,
              Key: { PK: pk, SK: monthSK },
              UpdateExpression: `
                SET yearMonth = :ym,
                    incomeTotal = if_not_exists(incomeTotal, :zero) + :amount,
                    expenseTotal = if_not_exists(expenseTotal, :zero),
                    updatedAt = :now
              `,
              ExpressionAttributeValues: {
                ':ym': yearMonth,
                ':amount': amount,
                ':zero': 0,
                ':now': now,
              },
            },
          },
        ],
      })
    );

    // 成功レスポンス
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        incomeId,
        occurredAt,
        yearMonth,
        source: category,
        amount,
        note: memo || null,
        createdAt: now,
      }),
    };
  } catch (error) {
    console.error('Error creating income:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create income' },
      }),
    };
  }
};
