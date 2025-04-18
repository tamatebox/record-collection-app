const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// 画像保存ディレクトリの確保
const imageDirs = [
  path.join(__dirname, '../public/images/record-covers/full-size'),
];

// ディレクトリが存在しない場合は作成
imageDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`ディレクトリを作成しました: ${dir}`);
  }
});

// アプリケーションの初期化
const app = express();

// データベース接続
const db = initializeDatabase();

// CORS設定
app.use(cors({
  origin: '*',
  credentials: true
}));

// 基本的なミドルウェア
app.use(createSessionConfig());
app.use(express.json());

// 静的ファイル配信
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

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
const port = parsedUrl.port;
const server = app.listen(port, '0.0.0.0', () => {
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
