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

// アプリケーションの初期化
const app = express();
const PORT = process.env.BACKEND_PORT || 3001;
const HOST = '0.0.0.0';  // Dockerコンテナ内での接続のため

// データベース接続
const db = initializeDatabase();

// CORS設定
app.use(cors({
  origin: [
    'http://frontend:3000',
    'http://localhost:3000',
    'http://backend:3001',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
const server = app.listen(PORT, HOST, () => {
  console.log(`サーバーが http://${HOST}:${PORT} で起動しました`);
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
