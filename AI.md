# レコードコレクション管理アプリ - AI向け技術解説

このドキュメントはAIがレコードコレクション管理アプリを理解・拡張するための技術的な詳細を提供します。

## 1. プロジェクト概要

このアプリケーションはユーザーのレコードコレクションを管理するためのReactベースのWebアプリケーションです。主な特徴：

- SQLiteデータベースを使用したレコード情報の保存
- Express.jsバックエンドによるRESTful API
- React SPA（シングルページアプリケーション）フロントエンド
- ソート、フィルタリング、詳細表示、編集機能
- レスポンシブデザイン（テーブル表示/カード表示切替）
- Discogs APIとの統合による追加情報取得

## 2. 技術スタックの詳細

### フロントエンド
- **React**: UIコンポーネントとステート管理
- **CSS**: コンポーネント固有のスタイル
- **Axios**: HTTP通信ライブラリ（APIとの通信）

### バックエンド
- **Express.js**: RESTful API提供
- **SQLite**: 軽量で設定不要なリレーショナルデータベース
- **Node.js**: サーバーサイドJavaScript環境
- **Disconnect**: Discogs API クライアントライブラリ

### デプロイ/開発
- **npm scripts**: アプリケーションの各種操作を自動化
  - `npm run server`: APIサーバー起動（dotenvで環境変数を読み込み）
  - `npm start`: React開発サーバー起動
  - `npm run init-db`: データベース初期化

## 3. アーキテクチャ図

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend ├─────►│  Express API    ├─────►│  SQLite DB      │
│                 │◄─────┤                 │◄─────┤                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
    |        ▲           ┌─────────────────┐
    |        |           │  Discogs API    │
    ▼        |           │                 │
┌─────────────────┐      └─────────────────┘
│                 │
│  User Interface │
│                 │
└─────────────────┘
```

- Reactフロントエンドが管理するUI（テーブル表示、カード表示、詳細モーダル、編集フォーム）
- Express APIがCRUD操作を提供
- SQLiteデータベースが永続化を担当
- Discogs APIとの外部連携

## 4. サーバーアーキテクチャ

```
server/
├── server.js              # メインサーバーエントリーポイント
├── config/
│   ├── database.js        # データベース接続設定
│   └── session.js         # セッション設定
├── routes/
│   ├── index.js           # メインルーターファイル
│   ├── records.js         # レコード関連のルート
│   └── discogs.js         # Discogs関連のルート
├── middleware/
│   └── errorHandler.js    # 共通エラーハンドリング
└── records.db             # SQLiteデータベース
```

### アーキテクチャの主な特徴
- **モジュール性**: 各機能が独立したモジュールに分割
- **関心の分離**: ルーティング、データベース、セッション管理を分離
- **拡張性**: 新機能の追加が容易
- **エラーハンドリング**: 一元化されたエラー処理

## 5. ディレクトリ構造と重要ファイル

```
record-collection-app/
  ├── public/             # 静的ファイル
  ├── server/             # バックエンドサーバー
  │    ├── server.js      # Express APIサーバー（RESTエンドポイント定義）
  │    ├── init-db.js     # データベース初期化スクリプト（JSONデータ取り込み）
  │    ├── routes/        # APIルート管理
  │    │    ├── records.js
  │    │    └── discogs.js
  │    └── records.db     # SQLiteデータベース（自動生成）
  ├── src/                # Reactアプリケーション
  │    ├── components/    # UIコンポーネント
  │    │    ├── AddRecordForm.js    # レコード追加フォーム
  │    │    ├── RecordDetail.js     # レコード詳細表示と編集
  │    │    ├── RecordList.js       # レコード一覧（テーブル/カード表示）
  │    │    ├── RecordFilter.js     # フィルタリングコンポーネント
  │    │    └── [その他UI要素]
  │    ├── utils/         # ユーティリティ関数
  │    │    └── api.js    # AxiosベースのAPI通信関数
  │    ├── hooks/         # カスタムReactフック
  │    │    └── useRecords.js # レコードデータ管理フック
  │    ├── App.js         # メインアプリケーションコンポーネント
  │    └── index.js       # エントリーポイント
  ├── extracted_records.json  # 元のレコードデータ
  └── package.json        # 依存関係と実行スクリプト
```

## 6. データモデルと状態管理

### SQLiteスキーマ

主要テーブル: `records`

```sql
CREATE TABLE records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist TEXT,
  album_name TEXT,
  release_year TEXT,
  genre TEXT,
  country TEXT,
  size TEXT,
  label TEXT,
  compilation INTEGER,
  star INTEGER,
  review TEXT,
  alphabet_artist TEXT,
  music_link TEXT,
  acquisition_date TEXT,
  storage_location TEXT,
  catalog_number TEXT
);
```

### React状態管理

主に `useRecords` カスタムフックによる状態管理:

```javascript
// useRecords.js の主要な状態
const [records, setRecords] = useState([]);          // 全レコード
const [filteredRecords, setFilteredRecords] = useState([]); // フィルター後
const [selectedRecord, setSelectedRecord] = useState(null);  // 選択レコード
const [filters, setFilters] = useState({...});      // 適用中フィルター
const [sortConfig, setSortConfig] = useState({...}); // ソート設定
```

## 7. Discogs API統合

### 認証方法
- パーソナルアクセストークンを使用した自動認証
- 環境変数(`DISCOGS_PERSONAL_ACCESS_TOKEN`)からトークンを取得
- ユーザーに認証操作を要求しない自動フロー

### 環境変数設定
アプリケーションのルートディレクトリに`.env`ファイルを作成し、以下の形式でトークンを設定します：

```
DISCOGS_PERSONAL_ACCESS_TOKEN=your_personal_access_token_here
```

### トークンの取得方法
1. Discogsアカウントにログイン
2. 設定 > 開発者設定に移動
3. "Generate new token"ボタンをクリック
4. 生成されたトークンをコピー
5. アプリケーションの`.env`ファイルに貼り付け

### 主要エンドポイント
- `/api/discogs/token`: 環境変数からパーソナルアクセストークンを取得
- `/api/discogs/search`: レコード検索
- `/api/discogs/release/:id`: 特定のリリース詳細取得

## 8. 主要機能の実装詳細

[既存の実装詳細を保持]

## 9. 既知の課題とTODO

- **認証の強化**: セキュリティ向上のための追加検証
- **認証機能**: 現在ユーザー認証なし
- **画像サポート**: レコードジャケット画像の保存機能未実装
- **バリデーション**: より堅牢なフォーム入力検証が必要
- **テスト**: 自動テストの追加が望ましい
- **パフォーマンス**: 大量レコード処理時の最適化未対応

## 10. 拡張方法のガイド

### 新規フィールド追加手順

[既存の拡張方法のガイドを保持]

### 新規機能追加例

[既存の新規機能追加例を保持]

## 11. セキュリティと認証

### OAuth認証
- Discogsとの安全な認証フロー
- セッションベースのトークン管理
- 環境変数による機密情報の保護

### クロスオリジン通信の設定
- React開発サーバー（ポート3000）とExpressサーバー（ポート3001）間の通信
- `package.json`の`proxy`設定でAPIリクエストをポート3001に転送
- APIリクエストに直接URLを使用（`http://localhost:3001/api/*`）
- `cors`ライブラリでExpressサーバー側のCORS設定を管理

---

このAI.mdファイルは、プロジェクトのアーキテクチャと技術的詳細を包括的に説明し、AIが迅速にプロジェクトを理解し、有意義な貢献ができるようにするための技術的参照資料です