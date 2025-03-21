const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 設定モジュール
const { initializeDatabase } = require('./config/database');
const { createSessionConfig } = require('./config/session');

// ミドルウェア
const errorHandler = require('./middleware/errorHandler');

// ルーター
const routes = require('./routes');

// 環境変数から設定を取得
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// CORS origin を FRONTEND_HOST と FRONTEND_PORT から動的に生成
const corsOrigins = [
  `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
  `http://localhost:${process.env.FRONTEND_PORT}`,
  'http://localhost:3000'  // 開発環境用の追加オプション
].filter(Boolean);  // nullや空文字を除外


// アプリケーションの初期化
const app = express();

// データベース接続
const db = initializeDatabase();

// CORS設定
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

// 基本的なミドルウェア
app.use(createSessionConfig());
app.use(express.json());

// リクエストログ
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ルーター設定
app.use('/api', routes);

// エラーハンドリング
app.use(errorHandler);

// サーバー起動
const parsedUrl = new URL(REACT_APP_API_URL);
const host = parsedUrl.hostname;
const port = parsedUrl.port;
const server = app.listen(port, host, () => {
  console.log(`サーバーが ${REACT_APP_API_URL} で起動しました`);
});

// グレースフルシャットダウン
process.on('SIGINT', () => {
  console.log('サーバーを停止しています...');
  server.close(() => {
    db.close();
    console.log('サーバーと接続を正常に終了しました');
    process.exit(0);
  });
});

module.exports = app;
