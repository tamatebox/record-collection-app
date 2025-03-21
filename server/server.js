const express = require('express');
const cors = require('cors');
const path = require('path');
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
const PORT = process.env.PORT || 3001;

// データベース接続
const db = initializeDatabase();

// ミドルウェアの設定
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'], // 複数のオリジンを許可
  credentials: true
}));
app.use(createSessionConfig());
app.use(express.json());

// ルーターの設定
app.use('/api', routes);

// エラーハンドリングミドルウェア（最後に配置）
app.use(errorHandler);

// サーバーの起動
const server = app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
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
