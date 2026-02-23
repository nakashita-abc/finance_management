# 家計簿管理アプリ（Portfolio）

## 1. 概要（Overview）

収入・支出を記録し、グラフで家計を可視化する **サーバーレス SPA** です。

- 支出・収入の登録・一覧表示
- カテゴリ別ドーナツチャートと月次推移折れ線グラフによるダッシュボード
- Amazon Cognito による認証（OAuth 2.0 Authorization Code Flow）
- AWS Lambda + DynamoDB によるサーバーレスバックエンド

---

## 2. デモ

**URL**: https://main.d28mj8dz6wqkv9.amplifyapp.com

以下のデモ用アカウントでログインしてお試しいただけます。

| 項目 | 値 |
|------|-----|
| メールアドレス | kosei0224.9973@gmail.com |
| パスワード | Demo1234! |

---

## 3. 使用技術（Tech Stack）

### Frontend
| 技術 | 用途 |
|------|------|
| React 18 | UI フレームワーク |
| TypeScript | 型安全な開発 |
| Vite | ビルドツール・開発サーバー |
| Chakra UI | UIコンポーネントライブラリ |
| Chart.js | グラフ描画（ドーナツ・折れ線） |
| React Hook Form | フォーム管理・バリデーション |
| react-oidc-context | Cognito OIDC 認証フロー |
| React Router | クライアントサイドルーティング |

### Backend
| 技術 | 用途 |
|------|------|
| Node.js | Lambda ランタイム |
| AWS Lambda | サーバーレス関数実行 |

### API
| 技術 | 用途 |
|------|------|
| API Gateway（HTTP API） | REST エンドポイント公開・認可 |

### Database
| 技術 | 用途 |
|------|------|
| DynamoDB | NoSQL データストア（シングルテーブル設計） |

### 認証
| 技術 | 用途 |
|------|------|
| Amazon Cognito | ユーザー管理・JWT 発行 |

### インフラ・デプロイ
| 技術 | 用途 |
|------|------|
| S3 + CloudFront | フロントエンド静的ホスティング・CDN |
| AWS Amplify | CI/CD・フロントエンドデプロイ |

---

## 4. アーキテクチャ

```
[ブラウザ]
    │  OAuth 2.0 Authorization Code Flow
    ▼
[Amazon Cognito]  ─── IDトークン発行 ───▶ [ブラウザ（SPA）]
                                                │
                                   Bearer Token │
                                                ▼
                                     [API Gateway HTTP API]
                                                │
                               Lambda Authorizer│ (JWT検証)
                                                ▼
                                         [AWS Lambda]
                                                │
                                                ▼
                                          [DynamoDB]
                                     （シングルテーブル設計）

[S3 + CloudFront]
    └── フロントエンド（Vite ビルド成果物）配信
```

- S3 + CloudFront によるフロントエンド配信
- API Gateway 経由で Lambda を実行
- Lambda Authorizer が Cognito IDトークンを検証しユーザー ID を抽出
- Lambda から DynamoDB へアクセス（シングルテーブル設計）
- サーバーレス構成によりインフラ管理コストを最小化

### 技術選定理由

- **サーバーレス採用理由**
  - 小規模アプリに適したコスト効率（リクエスト単位の課金）
  - インフラ管理負荷の軽減（EC2 サーバーの運用不要）
- **DynamoDB採用理由**
  - アクセスパターンベース設計で必要なクエリのみ最適化
  - サーバーレスとの親和性が高くオンデマンドキャパシティで自動スケーリング
- **HTTP API採用理由**
  - REST API より低コスト・低レイテンシ
  - Lambda Authorizer で JWT 検証を一元化
- **Cognito採用理由**
  - パスワード管理・JWT 発行をマネージドサービスに委譲
  - OIDC 標準準拠で react-oidc-context と統合しやすい

---

## 5. 設計思想

### フロントエンド

**責務の分離**
- **Page コンポーネント**: データ取得・フェッチ状態管理（loading / success / error）に専念
- **Form コンポーネント**: 入力 UI・クライアントバリデーションに専念
- **Chart コンポーネント**: データ受け取りとグラフ描画に専念
- **カスタムフック**: API 呼び出し・認証トークン付与・ステータス管理を隠蔽

この分離により、各コンポーネントの役割が明確になり、修正範囲を最小限に抑えられる。

**型安全性**
- TypeScript で API レスポンス・フォームデータ・コンポーネント Props をすべて型定義
- `src/types/` に型定義を集約し、フロントエンド全体で一貫した型を使用

### バックエンド

**DynamoDB シングルテーブル設計**
- 複数エンティティ（支出・収入・集計）を 1 テーブルに格納
- PK/SK の命名規則で高速な Query を実現（スキャン不要）
- 集計アイテム（MONTH / CAT）を事前計算・保存することでダッシュボードの API 呼び出しを 1 回に集約

**データ整合性**
- 支出・収入登録時に `TransactWrite` で明細と集計アイテムを同時更新
- トランザクション失敗時はロールバックし、集計値のズレを防止

---

## 6. API設計

### 主なエンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/dashboard` | ダッシュボード表示用データ取得（サマリー・グラフ） |
| GET | `/expenses` | 支出一覧取得（`?ym=YYYY-MM` で月指定可能） |
| POST | `/expense/create` | 支出登録 |
| POST | `/income/create` | 収入登録 |

すべてのエンドポイントは `Authorization: Bearer {IDToken}` ヘッダーが必要。

### エンドポイント詳細

**GET /dashboard**

レスポンス例：
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
      { "yearMonth": "2025-08", "expenseTotal": 24710, "incomeTotal": 300000, "incomeExpenseDiff": 275290 },
      { "yearMonth": "2025-09", "expenseTotal": 0, "incomeTotal": 0, "incomeExpenseDiff": 0 }
    ]
  }
}
```

**POST /expense/create**

リクエスト例：
```json
{
  "occurredAt": "2025-08-15T10:23:45.123Z",
  "category": "食費",
  "amount": 3200,
  "note": "スーパーで食材購入"
}
```

**POST /income/create**

リクエスト例：
```json
{
  "occurredAt": "2025-08-01T00:00:00.000Z",
  "category": "給与",
  "amount": 300000,
  "memo": "8月分給与"
}
```

### 設計方針

- **認証**: Lambda Authorizer が Bearer Token（Cognito JWT）を検証し、`userId`（sub クレーム）を Lambda に渡す
- **エラーレスポンス**: 統一フォーマット `{ error: { code, message, details } }` で返却
- **月指定**: `ym=YYYY-MM` クエリパラメータで任意月の一覧取得に対応

---

## 7. データベース設計（DynamoDB）

### 設計方針

シングルテーブル設計を採用。PK/SK の命名規則でエンティティを識別し、`begins_with` による高速 Query を実現する。

| 項目 | 値 |
|------|-----|
| テーブル名 | `FinanceTable` |
| パーティションキー | `PK` (String) |
| ソートキー | `SK` (String) |
| キャパシティ | オンデマンド |

### PK / SK パターン

| エンティティ | PK | SK |
|------------|----|----|
| 支出明細 | `USER#{userId}` | `EXP#{YYYY-MM}#{occurredAtISO}#{expenseId}` |
| 収入明細 | `USER#{userId}` | `INC#{YYYY-MM}#{occurredAtISO}#{incomeId}` |
| 月別集計 | `USER#{userId}` | `MONTH#{YYYY-MM}` |
| カテゴリ別集計 | `USER#{userId}` | `CAT#{YYYY-MM}#{category}` |

### 想定アクセスパターン

| 操作 | DynamoDB 操作 | キー条件 |
|------|-------------|---------|
| 当月支出一覧 | Query | PK=`USER#xxx` & SK begins_with `EXP#2025-08` |
| カテゴリ別集計（当月） | Query | PK=`USER#xxx` & SK begins_with `CAT#2025-08` |
| 月次推移（直近6ヶ月） | BatchGet | 6件の `MONTH#YYYY-MM` を一括取得 |
| 支出登録 | TransactWrite | EXP 明細 Put + MONTH 加算 + CAT 加算 |
| 支出削除 | TransactWrite | EXP 明細 Delete + MONTH 減算 + CAT 減算 |

**SK の設計ポイント**：`EXP#YYYY-MM#` プレフィックスにより、月を指定した Query が O(対象月のアイテム数) で完結し、全件スキャンが不要。

---

## 8. 工夫した点

### 1. DynamoDB シングルテーブル設計
SK に `EXP#YYYY-MM#ISO8601#ID` という階層構造を持たせることで、月単位のクエリを `begins_with` だけで実現。集計アイテム（`MONTH` / `CAT`）を事前計算して保存することで、ダッシュボードの API 呼び出しを 1 回に絞り込んだ。

### 2. TransactWrite による整合性保証
支出・収入の登録・削除時に `TransactWrite` を使用し、明細アイテムと集計アイテムをアトミックに更新。トランザクション失敗時はロールバックされるため、集計値のズレが発生しない。

### 3. カスタムフックによる関心の分離
`useAuthFetch` が Bearer Token の自動付与・ステータス管理（idle / loading / success / error）を隠蔽。個別のフック（`useCreateExpense` / `useGetExpenseList`）はビジネスロジックのみに集中でき、コンポーネントはUIに専念できる。

### 4. 0 円カテゴリの補完処理
DBに存在しないカテゴリ・月であっても、固定カテゴリリストと直近6ヶ月のリストを使って API レベルで 0 円補完してレスポンスを返す。これにより、フロントエンドは常に全カテゴリ・全月のデータを受け取れ、グラフ表示のロジックをシンプルに保てる。

### 5. Cognito OAuth 2.0 + react-oidc-context 統合
Authorization Code Flow を react-oidc-context に任せることで、トークン取得・更新・ストレージ管理を自前実装せずに済んだ。`ProfileProvider` で取得したユーザー情報（メール等）を Context 経由で全コンポーネントから参照できる。

---

## 9. 今後の改善予定

- [ ] DynamoDBに収入、支出のカテゴリエンティティ追加
- [ ] 支出の編集・削除機能の追加
- [ ] 月次予算の設定・予算達成率の可視化
- [ ] 支出一覧の月切り替え機能（当月以外も参照）
- [ ] 収入一覧ページの追加
- [ ] テスト実装（Vitest / Jest による単体テスト）
- [ ] Lambda のエラーハンドリング・バリデーション強化
- [ ] レスポンシブデザインのさらなる最適化（モバイル対応強化）

---

## 10. 学び・設計上の気付き

### DynamoDB のアクセスパターン先行設計の重要性
RDB と異なり、DynamoDB はテーブル作成後のスキーマ変更が困難。「どのクエリが必要か」を最初に洗い出し、それに合わせて PK/SK を設計することで、後から困らない設計ができた。シングルテーブル設計の初期のとっつきにくさは、PK/SK のパターンを整理することで解消できた。

### サーバーレスにおける整合性の考え方
Lambda + DynamoDB ではトランザクション管理を自前で実装する必要があり、`TransactWrite` の使い所を意識する機会になった。RDB の `BEGIN / COMMIT` に相当する処理を DynamoDB でどう実現するかを学べた。

### フロントエンドの状態管理とカスタムフック
フェッチ処理をカスタムフックに切り出すことで、コンポーネントのコードが格段にすっきりした。`loading / success / error` の状態を統一的に扱うパターンは、今後のプロジェクトでも再利用できると感じた。

### 認証フローの全体像の理解
Cognito + OIDC のフローを一から実装したことで、Authorization Code Flow・IDトークン・Bearer Token・Lambda Authorizer による検証の全体像を具体的に理解できた。
