const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'records.db');

// データベースが存在しない場合のみ初期化
function initializeDatabase() {
  // データベースファイルが既に存在する場合は何もしない
  if (fs.existsSync(dbPath)) {
    console.log('データベースは既に存在します。初期化をスキップします。');
    return;
  }

  console.log('データベースの初期化を開始します...');

  // データベース接続
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // レコードテーブルの作成
    db.run(`CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      artist TEXT,
      album_name TEXT,
      release_year TEXT,
      genre TEXT,
      country TEXT,
      size TEXT,
      label TEXT,
      compilation INTEGER,
      star TEXT,
      review TEXT,
      alphabet_artist TEXT,
      music_link TEXT,
      acquisition_date TEXT,
      storage_location TEXT,
      catalog_number TEXT,
      discogs_id TEXT
    )`, (err) => {
      if (err) {
        console.error('テーブル作成エラー:', err);
        return;
      }

      console.log('データベーステーブルを作成しました。');
    });
  });

  // データベース接続をクローズ
  db.close((err) => {
    if (err) {
      console.error('データベース接続のクローズ中にエラーが発生しました:', err);
    } else {
      console.log('データベースの初期化が完了しました。');
    }
  });
}

// データベースの初期化を実行
initializeDatabase();
