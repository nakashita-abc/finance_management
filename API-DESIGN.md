
---

```md
# api-design.md
# 家計簿アプリ API設計書（REST / v1）

## 1. 目的
- ダッシュボード初期表示に必要なデータを1回で返す。
- 将来の機能追加に耐えるよう、レスポンスは「summary」「charts」に分離する。

---

## 2. 共通仕様

### 2.1 認証
- 想定: Cognito等のJWTによる認証
- すべてのエンドポイントは認証必須（401/403）

### 2.2 日付・タイムゾーン
- `occurredAt` は ISO-8601 文字列
- `yearMonth` は `YYYY-MM`
- 月の判定は `occurredAt` から導出（サーバー側で処理）

### 2.3 数値
- 金額は number（整数想定）
- 支出はマイナスも許容（返金等）

### 2.4 エラーフォーマット（例）
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ym must be YYYY-MM",
    "details": [
      { "field": "ym", "reason": "invalid_format" }
    ]
  }
}

### 2.5 フォーマット（例）
```json
{
  "summary": {
    "expenseTotal": 24710,
    "incomeTotal": 300000,
    "incomeExpenseDiff": 275290
  },
  "charts": {
    "categoryExpenses": [
      { "category": "食費", "amount": 3760 },
      { "category": "交通費", "amount": 480 }
    ],
    "monthlyTrend": [
      { "yearMonth": "2024-08", "expenseTotal": 0, "incomeTotal": 0, "incomeExpenseDiff": 0 },
      { "yearMonth": "2024-09", "expenseTotal": 32000, "incomeTotal": 0, "incomeExpenseDiff": -32000 }
    ]
  }
}
