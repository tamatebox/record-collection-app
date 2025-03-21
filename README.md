# レコードコレクション管理アプリ

## 開発環境セットアップ

### 前提条件
- Node.js (v18以降)
- Docker
- Docker Compose

## 環境変数設定

1. `.env`ファイルを作成
   ```bash
   cp .env.example .env
   ```

2. `.env`ファイルに必要な環境変数を設定
   ```
   # アプリケーション設定
   NODE_ENV=development

   # バックエンド設定
   BACKEND_PORT=3001
   BACKEND_HOST=backend

   # フロントエンド設定
   FRONTEND_PORT=3000
   FRONTEND_HOST=frontend

   # Discogs API設定
   DISCOGS_PERSONAL_ACCESS_TOKEN=your_discogs_token_here
   ```

## Docker での起動

### 事前準備
- Docker と Docker Compose がインストールされていること

### アプリケーションの起動
```bash
# 全サービスを起動（開発モード）
docker compose up --build

# 特定のサービスのみ起動
docker compose up --build frontend
docker compose up --build backend

# バックグラウンドで起動
docker compose up -d --build
```

### その他のDocker Composeコマンド
```bash
# コンテナの停止と削除
docker compose down

# コンテナの一時停止
docker compose stop

# コンテナの再開
docker compose start
```

## ローカル環境での開発

### パッケージのインストール
```bash
npm install
```

### データベースの初期化
```bash
npm run init-db
```

### 開発サーバーの起動
1. バックエンドサーバー
   ```bash
   npm run server
   ```

2. フロントエンド
   ```bash
   npm start
   ```

## プロジェクト構造

```
record-collection-app/
├── server/             # バックエンドサーバー
│   ├── server.js       # Express APIサーバー
│   └── init-db.js      # データベース初期化スクリプト
├── src/                # Reactフロントエンド
│   ├── components/     # UIコンポーネント
│   └── utils/          # ユーティリティ関数
├── Dockerfile.frontend # フロントエンド用Dockerfile
├── Dockerfile.backend  # バックエンド用Dockerfile
└── docker-compose.yml  # Docker Compose設定
```

## 注意事項

- Dockerを使用する場合は、必ず環境変数を適切に設定してください
- Discogsトークンは、Discogs APIを使用するために必要です
- 初回起動時は、データベースの初期化に時間がかかる場合があります

## トラブルシューティング

- Docker起動時に問題がある場合は、`docker-compose.yml`と環境変数を確認してください
- パッケージのインストールで問題が発生した場合は、Node.jsのバージョンを確認してください
- データベース関連の問題は、`npm run init-db`を実行して解決できる場合があります

## 今後の拡張予定

- ユーザー認証機能の追加
- レコード画像アップロード機能
- 高度な検索とフィルタリング
- レコメンデーション機能
