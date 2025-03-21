const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'records.db');

// データベース接続の確認と初期化
const initializeDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    console.error('データベースファイルが見つかりません。最初に `npm run init-db` を実行してください。');
    process.exit(1);
  }

  const db = new sqlite3.Database(dbPath, err => {
    if (err) {
      console.error('データベースへの接続に失敗しました:', err);
      process.exit(1);
    }
    console.log('SQLiteデータベースに接続しました');
  });

  // データベース終了処理
  process.on('exit', () => {
    db.close();
    console.log('データベース接続を閉じました');
  });

  return db;
};

module.exports = {
  initializeDatabase
};
