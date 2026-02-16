import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.FINANCE_TABLE;

function getCurrentYmJst() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function isValidYm(ym) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(ym);
}

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  const httpMethod = event.requestContext?.http?.method;

  if (httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: { code: "METHOD_NOT_ALLOWED", message: "GET method required" },
      }),
    };
  }

  // Cognito認証からuserIdを取得
  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      }),
    };
  }

  // クエリパラメータから対象年月を取得
  const ym = event.queryStringParameters?.ym || getCurrentYmJst();

  if (!isValidYm(ym)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: {
          code: "VALIDATION_ERROR",
          message: "ym must be YYYY-MM format",
          details: [{ field: "ym", reason: "invalid_format" }],
        },
      }),
    };
  }

  const pk = `USER#${userId}`;
  const skPrefix = `EXP#${ym}#`;

  try {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": pk,
          ":skPrefix": skPrefix,
        },
        ScanIndexForward: false,
      })
    );

    const expenses = (result.Items ?? []).map((item) => ({
      date: item.occurredAt?.substring(0, 10) ?? "",
      category: item.category,
      title: item.note ?? "",
      amount: item.amount,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(expenses),
    };
  } catch (error) {
    console.error("Error fetching expense list:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: { code: "INTERNAL_ERROR", message: "Failed to fetch expenses" },
      }),
    };
  }
};
