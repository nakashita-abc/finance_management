import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "portfolio-FinanceManagement";

const FIXED_CATEGORIES = ["食費","交通費","日用品","娯楽","通信費","医療費","衣服","交際費"];

function getNowYearMonthJst() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

const getMonth = (ym, delta) => {
  const [year, month] = ym.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - delta);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const createLastMonths = (endYm, months) => {
  const arr = [];
  for (let i = months - 1; i >= 0; i--) arr.push(getMonth(endYm, i));
  return arr; // 古い→新しい
};

//月別の辞書作成
const toMonthMap = (monthItems) => {
  const map = new Map();
  for (const it of (monthItems ?? [])) {
    const sk = it.SK;
    const ym = typeof sk === "string" ? sk.replace(/^MONTH#/, "") : null;
    if (!ym) continue;

    map.set(ym, {
      expenseTotal: Number(it.expenseTotal ?? 0),
      incomeTotal: Number(it.incomeTotal ?? 0),
    });
  }
  return map;
};

const buildMonthlyTrend = (yearMonths, monthMap) => {
  return yearMonths.map((ym) => {
    const v = monthMap.get(ym) ?? { expenseTotal: 0, incomeTotal: 0 };
    const expenseTotal = Number(v.expenseTotal ?? 0);
    const incomeTotal = Number(v.incomeTotal ?? 0);
    return {
      yearMonth: ym,
      expenseTotal,
      incomeTotal,
      incomeExpenseDiff: incomeTotal - expenseTotal,
    };
  });
};

//カテゴリの辞書作成
const buildCategoryExpenses = (ym, catItems) => {
  const catMap = new Map();

  for (const it of (catItems ?? [])) {
    const category =
      it.category ??
      (typeof it.SK === "string" ? it.SK.split("#").slice(2).join("#") : null); // CAT#YYYY-MM#{category}
    if (!category) continue;

    catMap.set(category, Number(it.totalAmount ?? 0));
  }

  return FIXED_CATEGORIES.map((cat) => ({
    category: cat,
    amount: Number(catMap.get(cat) ?? 0),
  }));
};

const buildSummary = (ym, monthMap) => {
  const v = monthMap.get(ym) ?? { expenseTotal: 0, incomeTotal: 0 };
  const expenseTotal = Number(v.expenseTotal ?? 0);
  const incomeTotal = Number(v.incomeTotal ?? 0);
  return {
    expenseTotal,
    incomeTotal,
    incomeExpenseDiff: incomeTotal - expenseTotal,
  };
};

export const handler = async (event) => {
  const ym = getNowYearMonthJst();
  const months = 6;

  let body;
  let statusCode = 200;
  const headers = { "Content-Type": "application/json; charset=utf-8" };

  try {
    // Cognito認証からuserIdを取得（HTTP API v2 の JWT Authorizer）
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Authentication required" }),
      };
    }
    const PK = `USER#${userId}`;

    const yearMonths = createLastMonths(ym, months);

    const monthRes = await dynamo.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": PK,
          ":skPrefix": "MONTH#",
        },
      })
    );

    const monthMap = toMonthMap(monthRes.Items);
    const monthlyTrend = buildMonthlyTrend(yearMonths, monthMap);

    // CATは当月だけ
    const categoryRes = await dynamo.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": PK,
          ":skPrefix": `CAT#${ym}#`,
        },
      })
    );

    const categoryExpenses = buildCategoryExpenses(ym, categoryRes.Items);
    const summary = buildSummary(ym, monthMap);

    body = {
      summary,
      charts: {
        categoryExpenses,
        monthlyTrend,
      },
    };
  } catch (error) {
    statusCode = 500;
    body = { message: error?.message ?? "Internal Server Error" };
  }

  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
};
