# 家計簿アプリ DynamoDB 設計書

## 1. 目的
本設計書は、React + AWS（API Gateway / Lambda / DynamoDB）で構築する
**家計簿アプリのバックエンド用 DynamoDB テーブル設計**をまとめたものである。

RDB の正規化設計ではなく、**アクセスパターン駆動の NoSQL 設計**を前提とする。

---

## 2. 前提技術スタック

- フロントエンド
  - React
  - TypeScript
  - Chakra UI
  - Vite
  - Chart.js

- バックエンド / インフラ
  - AWS Amplify
  - Amazon API Gateway (HTTP API)
  - AWS Lambda (Node.js)
  - Amazon DynamoDB
  - Amazon Cognito（認証）

---

## 3. 想定ユースケース

- 支出・収入の登録
- 支出の更新・削除
- 当月の支出一覧表示
- カテゴリ別支出金額の取得（円グラフ）
- 月別支出・収入の推移取得（折れ線グラフ）
- ダッシュボード表示（サマリーカード）

---

## 4. 想定アクセスパターン

| No | 内容 | DynamoDB操作 | 条件 |
|---|---|---|---|
| 1 | 支出/収入登録 | PutItem | PK + SK指定 |
| 2 | 支出更新 | UpdateItem | PK + SK指定 |
| 3 | 支出削除 | DeleteItem | PK + SK指定 |
| 4 | 当月支出一覧 | Query | PK + SK begins_with |
| 5 | カテゴリ別支出取得 | GetItem | PK + SK指定 |
| 6 | 月別推移取得 | Query | PK + SK begins_with |

※ Scan 操作は使用しない

---

## 5. エンティティ定義

DynamoDBでは「画面で直接利用するデータ単位」をエンティティとして扱う。

| エンティティ | 説明 |
|---|---|
| ユーザー | ユーザー基本情報 |
| 取引 | 支出・収入（同一構造） |
| 月次サマリ | 月ごとの支出・収入合計 |
| カテゴリ集計 | 月ごとのカテゴリ別支出合計 |

---

## 6. テーブル概要

### テーブル名
```
FinanceTable
```

### プライマリキー

| 属性名 | 型 | 説明 |
|---|---|---|
| PK | String | パーティションキー |
| SK | String | ソートキー |

※ キー名は汎用名とし、意味を持たせない

---

## 7. キー設計方針

### PK（Partition Key）

```
PK = USER#<cognitoUserId>
```

- ユーザー単位でデータを完全分離
- マルチユーザー対応

### SK（Sort Key）

```
<ENTITY_TYPE>#<識別子>
```

例：
- PROFILE
- TRANSACTION#2025-01-15#tx-001
- MONTH_SUMMARY#2025-01
- CATEGORY_SUMMARY#2025-01

---

## 8. アイテム設計

### 8.1 ユーザー（PROFILE）

| 属性 | 型 | 説明 |
|---|---|---|
| PK | String | USER#userId |
| SK | String | PROFILE |
| userName | String | 表示名 |
| createdAt | String | 作成日時 |

---

### 8.2 取引（支出・収入）

| 属性 | 型 | 説明 |
|---|---|---|
| PK | String | USER#userId |
| SK | String | TRANSACTION#yyyy-mm-dd#transactionId |
| type | String | EXPENSE / INCOME |
| category | String | カテゴリ名 |
| amount | Number | 金額 |
| date | String | 日付 |
| createdAt | String | 作成日時 |

---

### 8.3 月次サマリ（MONTH_SUMMARY）

| 属性 | 型 | 説明 |
|---|---|---|
| PK | String | USER#userId |
| SK | String | MONTH_SUMMARY#yyyy-mm |
| totalExpense | Number | 月の支出合計 |
| totalIncome | Number | 月の収入合計 |

---

### 8.4 カテゴリ集計（CATEGORY_SUMMARY）

| 属性 | 型 | 説明 |
|---|---|---|
| PK | String | USER#userId |
| SK | String | CATEGORY_SUMMARY#yyyy-mm |
| categories | Map | カテゴリ別金額 |

---

## 9. 画面別データ取得対応

| 画面 | 取得方法 |
|---|---|
| ダッシュボード | MONTH_SUMMARY, CATEGORY_SUMMARY |
| 支出一覧 | TRANSACTION を Query |
| 円グラフ | CATEGORY_SUMMARY |
| 折れ線グラフ | MONTH_SUMMARY を Query |

---

## 10. 設計上の注意点

- Scan は使用しない
- JOIN 前提の設計をしない
- 集計は事前計算して保存する
- Lambda での登録・更新時に集計を同時更新する

---

## 11. 今後の拡張候補

- 年次サマリ追加
- 予算エンティティ追加
- GSI を用いた横断検索

---

## 12. 参考資料（公式）

- AWS公式
  - Designing NoSQL Tables Using DynamoDB
  - Best Practices for DynamoDB
  - Single-Table Design Patterns

---
