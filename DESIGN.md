# 家計管理アプリ 設計書

## 目次
1. [概要](#概要)
2. [システムアーキテクチャ](#システムアーキテクチャ)
3. [技術スタック](#技術スタック)
4. [データモデル](#データモデル)
5. [認証・認可](#認証認可)
6. [ディレクトリ構成](#ディレクトリ構成)

---

## 概要

### プロジェクト名
Finance Management（家計管理アプリ）

### 目的
個人の家計管理を効率化し、支出の見える化を通じて健全な金銭管理をサポートするWebアプリケーション。モダンなフロントエンド技術とAWSサーバーレスアーキテクチャを組み合わせ、スケーラブルで保守性の高いシステムとして設計・実装した。

### 対象ユーザー
- 家計簿をつけたい個人ユーザー
- 支出を可視化して節約したい方
- シンプルで使いやすい家計管理ツールを求める方

### 技術的特徴
- **TypeScript**による型安全な開発
- **DynamoDBのシングルテーブル設計**（PK/SK構成）
- **AWS Cognito**によるセキュアな認証基盤
- **サーバーレスアーキテクチャ**によるコスト効率とスケーラビリティ
- **Chakra UI**によるコンポーネント指向設計
- **AWS Amplify**による継続的デプロイメント

---

## システムアーキテクチャ

### アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React 19 + TypeScript + Vite                          │ │
│  │  - Chakra UI (UIコンポーネント)                         │ │
│  │  - React Router (ルーティング)                          │ │
│  │  - Chart.js (データビジュアライゼーション)              │ │
│  │  - React OIDC Context (認証管理)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│                         AWS Amplify                          │
│                    (ホスティング・デプロイ)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cloud Services                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Amazon Cognito                                        │ │
│  │  - ユーザー認証・認可                                   │ │
│  │  - OAuth 2.0 / OpenID Connect                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Amazon API Gateway                                    │ │
│  │  - RESTful API エンドポイント                           │ │
│  │  - リクエストバリデーション                              │ │
│  │  - CORS設定                                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AWS Lambda                                            │ │
│  │  - サーバーレス関数実行                                 │ │
│  │  - ビジネスロジック実装                                 │ │
│  │  - Node.js Runtime                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Amazon DynamoDB                                       │ │
│  │  - NoSQLデータベース                                    │ │
│  │  - シングルテーブル設計                                 │ │
│  │  - PK: user_id, SK: yearMonth#id                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### データフロー

```
[ユーザー]
    │
    ▼
[AWS Amplify ホスティング]
    │
    ▼
[React SPA]
    │
    ├─ 認証 ──→ [Amazon Cognito]
    │              │
    │              ▼
    │         [IDToken取得]
    │
    ├─ API呼び出し ──→ [API Gateway]
                           │ (認証検証)
                           ▼
                       [AWS Lambda]
                           │
                           ▼
                     [DynamoDB]
                           │
                           ▼
                      [レスポンス]
```

---

## 技術スタック

### フロントエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.2.0 | UIフレームワーク |
| TypeScript | 5.9.3 | 型安全性の確保 |
| Vite | 7.2.4 | ビルドツール・高速開発サーバー |
| Chakra UI | 3.30.0 | UIコンポーネントライブラリ |
| React Router | 7.10.1 | クライアントサイドルーティング |
| Chart.js | 4.5.1 | グラフ描画ライブラリ |
| react-chartjs-2 | 5.3.1 | Chart.jsのReactラッパー |
| React Hook Form | 7.68.0 | フォーム管理 |
| React OIDC Context | 3.3.0 | OAuth/OIDC認証管理 |
| Axios | 1.13.2 | HTTPクライアント |
| React Icons | 5.5.0 | アイコンライブラリ |

### バックエンド (AWS)
| サービス | 用途 |
|---------|------|
| AWS Amplify | フロントエンドホスティング・CI/CD |
| Amazon Cognito | ユーザー認証・認可・IDプール管理 |
| API Gateway | RESTful APIエンドポイント・リクエスト制御 |
| AWS Lambda | サーバーレス関数実行・ビジネスロジック |
| Amazon DynamoDB | NoSQLデータベース・データ永続化 |

### 開発ツール
| ツール | 用途 |
|-------|------|
| ESLint | コード品質チェック |
| TypeScript ESLint | TypeScript用Lintルール |
| Git | バージョン管理 |
| Vite TSConfig Paths | パスエイリアス解決 |

---

## データモデル

### DynamoDB テーブル設計

#### シングルテーブル設計
テーブル名: `Expenses`（想定）

| 属性名 | 型 | 説明 |
|-------|---|------|
| **PK** (Partition Key) | String | `user_id` - ユーザーID（Cognito Sub） |
| **SK** (Sort Key) | String | `yearMonth#id` - 年月とIDの複合キー（例: `2025-01#uuid-123`） |
| date | String | 支出日（YYYY-MM-DD） |
| category | String | カテゴリ名 |
| title | String | 支出のタイトル/説明 |
| amount | Number | 金額 |
| createdAt | String | 作成日時（ISO 8601） |
| updatedAt | String | 更新日時（ISO 8601） |

#### アクセスパターン

**1. ユーザーの特定月の全支出を取得**
```
PK = user_id
SK begins_with "2025-01#"
```

**2. ユーザーの特定の支出を取得**
```
PK = user_id
SK = "2025-01#uuid-123"
```

**3. ユーザーの全支出を取得**
```
PK = user_id
```

### データ型定義（TypeScript）

```typescript
// Expense エンティティ
type Expense = {
  id: string;          // 支出ID（UUID）
  date: string;        // 日付（YYYY-MM-DD）
  category: string;    // カテゴリ
  title: string;       // タイトル/説明
  amount: number;      // 金額
}

// UserProfile
type UserProfile = {
  email: string;       // メールアドレス
  userId: string;      // ユーザーID（Cognito Sub）
  createdAt: string;   // 作成日時
}

// MonthlyCategorySummary（月次集計）
type MonthlyCategorySummary = {
  yearMonth: string;             // 年月（YYYY-MM）
  totalAmount: number;           // 合計金額
  categories: {
    name: string;                // カテゴリ名
    amount: number;              // カテゴリ別金額
  }[];
}
```

### カテゴリ一覧
- 食費
- 交通費
- 交際費
- 日用品
- 娯楽
- 通信費
- 電気・水道・ガス
- 医療費
- 衣服
- その他

---

## 認証・認可

### 認証フロー

```
1. ユーザーがログインボタンをクリック
   ↓
2. react-oidc-context が Cognito 認証画面にリダイレクト
   ↓
3. ユーザーが認証情報を入力
   ↓
4. Cognito が認証を検証
   ↓
5. 認証成功後、アプリにリダイレクト（認可コード付き）
   ↓
6. react-oidc-context が認可コードをトークンに交換
   ↓
7. IDトークン・アクセストークンを取得
   ↓
8. 認証済み状態でダッシュボードを表示
```

### Cognito設定

```typescript
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HUYvDB3aW",
  client_id: "22omuoadoaf3b2t1in154vjn9e",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};
```

### API認証

- **方式**: Bearer Token認証
- **トークン**: CognitoのIDトークンをAuthorizationヘッダーに付与
- **検証**: API Gateway + Lambda Authorizerでトークン検証

```typescript
// API呼び出し例
const response = await axios.get(apiUrl, {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
});
```

### ログアウトフロー

```
1. ユーザーがログアウトボタンをクリック
   ↓
2. Cognito ログアウトエンドポイントにリダイレクト
   ↓
3. セッション・トークンをクリア
   ↓
4. /logout ページにリダイレクト
   ↓
5. ユーザーがホームに戻る
   ↓
6. 未認証のホーム画面を表示
```

---

## ディレクトリ構成

```
finance_management/
├── public/                      # 静的ファイル
├── src/
│   ├── components/              # 再利用可能なコンポーネント
│   │   ├── auth/               # 認証関連
│   │   │   └── LoginForm.tsx
│   │   ├── expense/            # 支出関連
│   │   │   ├── charts/         # グラフコンポーネント
│   │   │   │   ├── CategoryPieChart.tsx
│   │   │   │   └── MonthlyBalanceBarChart.tsx
│   │   │   ├── ExpenseField.tsx
│   │   │   ├── ExpenseItem.tsx
│   │   │   └── ExpenseList.tsx
│   │   ├── layout/             # レイアウト
│   │   │   ├── Header.tsx
│   │   │   ├── HeaderMenu.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/                 # UIコンポーネント（Chakra UI）
│   │       ├── cards/
│   │       │   └── ChartCard.tsx
│   │       ├── color-mode.tsx
│   │       ├── password-input.tsx
│   │       ├── provider.tsx
│   │       ├── toaster.tsx
│   │       └── tooltip.tsx
│   ├── pages/                   # ページコンポーネント
│   │   ├── HomePage.tsx         # ホーム画面（未認証）
│   │   ├── LoginPage.tsx        # ログイン画面
│   │   ├── LogoutPage.tsx       # ログアウト画面
│   │   ├── DashboardPage.tsx    # ダッシュボード
│   │   ├── ExpenseListPage.tsx  # 支出一覧
│   │   └── ExpenseFormPage.tsx  # 支出登録・編集
│   ├── providers/               # Context Providers
│   │   └── ProfileProvider.tsx  # ユーザープロファイル管理
│   ├── hooks/                   # カスタムフック
│   │   └── useAuth.tsx          # 認証フック
│   ├── types/                   # TypeScript型定義
│   │   ├── expense.ts
│   │   └── userProfile.ts
│   ├── App.tsx                  # メインアプリコンポーネント
│   ├── App.css                  # アプリスタイル
│   ├── main.tsx                 # エントリーポイント
│   ├── index.css                # グローバルスタイル
│   └── aws-exports.ts           # AWS設定
├── package.json                 # 依存関係管理
├── tsconfig.json                # TypeScript設定
├── vite.config.ts               # Vite設定
├── eslint.config.js             # ESLint設定
└── DESIGN.md                    # 本設計書
```

### コンポーネント設計方針

#### Atomic Design inspired構成
- **pages/**: ページ全体を構成するコンポーネント
- **components/**: 再利用可能な機能別コンポーネント
  - `auth/`: 認証関連
  - `expense/`: 支出管理関連
  - `layout/`: レイアウト関連
  - `ui/`: 汎用UIコンポーネント

#### 責務の分離
- **Presentational Component**: UIの表示のみ担当
- **Container Component**: ロジックとデータ取得を担当
- **Custom Hooks**: ロジックの再利用

---

## API設計

### ベースURL
```
https://9vnts8haqd.execute-api.us-east-1.amazonaws.com
```

### 主要エンドポイント

#### 月次カテゴリ集計取得
```
GET /dashboard/getMonthlyCategorySummary
```

**リクエストヘッダー**:
```
Authorization: Bearer {idToken}
```

**レスポンス例**:
```json
{
  "yearMonth": "2025-01",
  "totalAmount": 20000,
  "categories": [
    { "name": "食費", "amount": 3200 },
    { "name": "交通費", "amount": 480 },
    { "name": "交際費", "amount": 980 }
  ]
}
```

---

## セキュリティ

### 実装済みセキュリティ対策

1. **認証・認可**
   - AWS Cognito による OAuth 2.0 / OpenID Connect
   - IDトークンによるAPI認証

2. **通信の暗号化**
   - HTTPS通信の強制
   - AWS証明書による安全な通信

3. **フロントエンド**
   - XSS対策（Reactの自動エスケープ）
   - CSRF対策（トークンベース認証）
   - 入力値のバリデーション（React Hook Form）

4. **バックエンド**
   - API Gatewayでのリクエスト検証
   - Lambdaでの認可チェック
   - DynamoDBのアクセス制御（IAMロール）

---

## 非機能要件

### パフォーマンス
- Viteによる高速ビルドと開発体験
- 動的インポートによるコード分割
- DynamoDBの低レイテンシー読み取り

### スケーラビリティ
- サーバーレスアーキテクチャによる自動スケーリング
- Lambda同時実行数の自動調整
- DynamoDBのオンデマンドキャパシティ

### 保守性
- TypeScriptによる型安全性
- コンポーネント指向設計
- ESLintによるコード品質維持
- 明確なディレクトリ構成

### 可用性
- AWS Amplifyの自動デプロイ
- 複数AZにまたがるAWSサービス
- DynamoDBの自動バックアップ

---

## まとめ

本アプリケーションは、モダンなフロントエンド技術とAWSサーバーレスアーキテクチャを組み合わせた、スケーラブルで保守性の高い家計管理システムです。

### 技術的強み
- **型安全性**: TypeScriptによる堅牢な開発
- **DynamoDBシングルテーブル設計**: 効率的なデータモデリング
- **サーバーレス**: コスト効率とスケーラビリティの両立
- **モダンUI**: Chakra UIによる保守性の高いコンポーネント設計
- **継続的デプロイ**: Amplifyによる自動化されたCI/CD

---

**作成日**: 2025-01-17
**バージョン**: 1.0
