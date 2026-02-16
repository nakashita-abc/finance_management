# 家計簿アプリ DB設計書（DynamoDB）

## 1. 目的
- 家計簿アプリの支出/収入の明細管理と、ダッシュボード表示（カテゴリ別・月次推移）を高速に行う。
- 初期スコープはシンプルにし、壊れにくく保守しやすい設計とする。

---

## 2. 想定アクセスパターン
- 支出登録
- 収入登録（すべて手入力）
- 支出更新
- 支出削除
- 支出一覧（指定月）
- カテゴリ別支出金額取得（指定月）
- 月別データ取得（直近6ヶ月、0埋め）

---

## 3. 採用方針
### 3.1 Single Table Design（1テーブル）
- 明細（支出/収入）と集計（月別/カテゴリ別）を同一テーブルで管理する。

### 3.2 集計アイテムを持つ（派生データ）
- ダッシュボード表示のために、以下を「集計アイテム」として保持する。
  - 月別集計（MONTH）
  - カテゴリ別集計（CAT）
- 集計は明細登録/更新/削除のタイミングで更新する。
- `diff`（収入−支出）は保存しない（APIで計算して返す）。

### 3.3 0埋めの仕様
- 月次推移は必ず直近6ヶ月分を返すため、存在しない月は 0埋めして扱う（DB側にアイテムがなくてもOK）。
- カテゴリ別支出は「カテゴリ固定リスト」を基準に0円も返す（0円カテゴリはDBに存在しなくてもOK）。

---

## 4. テーブル定義

### 4.1 テーブル名
- `finance_management`（例）

### 4.2 主キー
- Partition Key: `PK` (String)
- Sort Key: `SK` (String)

### 4.3 PK/SK 命名
- キー名は汎用性を優先し `PK` / `SK` を採用する。

---

## 5. アイテム種別とキー設計（PK/SKパターン）

### 5.1 共通
- PK: `USER#{userId}`

---

### 5.2 支出明細（Expense）
- SK: `EXP#{yyyy-mm}#{occurredAtIso}#{expenseId}`
  - 例: `EXP#2025-01#2025-01-15T10:23:45.123Z#e_01f...`

属性（例）
- `expenseId` (string) : UUID v4
- `occurredAt` (string) : ISO-8601（UTC推奨）
- `yearMonth` (string) : `YYYY-MM`（発生日から導出）
- `category` (string)
- `amount` (number) : 確定支出。マイナス支出（返金等）も許容。
- `note` (string, optional)
- `createdAt` (string)
- `updatedAt` (string)

---

### 5.3 収入明細（Income）
- SK: `INC#{yyyy-mm}#{occurredAtIso}#{incomeId}`

属性（例）
- `incomeId` (string) : UUID v4
- `occurredAt` (string)
- `yearMonth` (string)
- `amount` (number)
- `source` (string, optional) : 給与/副業/その他
- `note` (string, optional)
- `createdAt` (string)
- `updatedAt` (string)

---

### 5.4 月別集計（Month Aggregate）
- SK: `MONTH#{yyyy-mm}`
  - 例: `MONTH#2025-01`

属性（例）
- `yearMonth` (string)
- `expenseTotal` (number) : 確定支出の合計（マイナスも含む）
- `incomeTotal` (number) : 収入合計（すべて手入力の合計）
- `budget` (number) : 月予算
- `updatedAt` (string)

※ `incomeExpenseDiff` は保存しない（APIで計算）。

---

### 5.5 カテゴリ別集計（Category Aggregate）
- SK: `CAT#{yyyy-mm}#{category}`
  - 例: `CAT#2025-01#食費`

属性（例）
- `yearMonth` (string)
- `category` (string)
- `totalAmount` (number) : 指定月×カテゴリの支出合計（マイナスも含む）
- `updatedAt` (string)

---

## 6. カテゴリマスタ（固定リスト）
- 0円カテゴリも返すため、カテゴリは固定リストを採用する。
- API/フロントでこのリストを基準に並び順を固定し、存在しないカテゴリは0円として返す。

例:
- 食費
- 交通費
- 日用品
- 娯楽
- 通信費
- 医療費
- 衣服
- 交際費

---

## 7. クエリ設計（アクセスパターン対応）

### 7.1 支出一覧（指定月）
- Query
  - PK = `USER#{userId}`
  - SK begins_with `EXP#YYYY-MM#`
  - 降順（新しい順）で返す場合は ScanIndexForward=false

### 7.2 カテゴリ別支出（指定月）
- Query
  - PK = `USER#{userId}`
  - SK begins_with `CAT#YYYY-MM#`

※ 返却時はカテゴリ固定リストを基準に0円補完する。

### 7.3 月次推移（直近6ヶ月）
- 推奨: BatchGet（6件分の `MONTH#YYYY-MM` をまとめて取得）
- 取得結果を yearMonth でマップ化し、存在しない月は0埋めで返す。

---

## 8. 更新（集計の整合性）
### 8.1 基本方針
- 支出/収入の登録・更新・削除の際に、MONTH/CAT を差分更新する。
- 途中失敗で集計がズレないよう、可能な限りトランザクション（TransactWrite）を使用する。

### 8.2 支出登録（例）
- Put: EXP明細
- Update: MONTH#YYYY-MM expenseTotal += amount
- Update: CAT#YYYY-MM#category totalAmount += amount

### 8.3 支出更新（差分）
- 旧明細を取得（Get）
- delta を計算し、以下をトランザクションで行う
  - 明細の更新
  - MONTH/CAT の増減（カテゴリ変更・月跨ぎの場合は旧側減算＋新側加算）

### 8.4 支出削除
- 旧明細を取得
- Delete 明細
- MONTH/CAT を減算

---

## 9. ID採番
- `expenseId` / `incomeId` は UUID v4 を採用する（API側で生成）。

---

## 10. サンプルデータ

### 10.1 MONTH
```json
{
  "PK": "USER#u123",
  "SK": "MONTH#2025-01",
  "yearMonth": "2025-01",
  "expenseTotal": 24710,
  "incomeTotal": 300000,
  "budget": 50000,
  "updatedAt": "2026-01-31T02:10:00Z"
}