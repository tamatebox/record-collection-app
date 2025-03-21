const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'records.db');

// データベース接続
const db = new sqlite3.Database(dbPath);

// テーブル作成とデータ挿入を行う関数
function initializeDatabase() {
  console.log('データベースの初期化を開始します...');
  
  // 既存のデータベースファイルが存在する場合は削除
  if (fs.existsSync(dbPath)) {
    console.log('既存のデータベースファイルを削除します...');
    fs.unlinkSync(dbPath);
    console.log('データベースファイルを削除しました。');
  }
  
  // 新しいデータベース接続を作成
  const db = new sqlite3.Database(dbPath);
  
  // テーブル作成
  db.serialize(() => {
    console.log('レコードテーブルを作成します...');
    
    // records テーブルの作成
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
      catalog_number TEXT
    )`);
    
    // JSONファイルからデータを読み込む
    const jsonPath = path.join(__dirname, '..', 'extracted_records.json');
    console.log(`JSONファイルを読み込みます: ${jsonPath}`);
    
    fs.readFile(jsonPath, 'utf8', (err, data) => {
      if (err) {
        console.error('JSONファイルの読み込みに失敗しました:', err);
        return;
      }
      
      // JSONデータをパースする
      const records = JSON.parse(data);
      console.log(`${records.length}件のレコードデータを読み込みました。`);
      
      // トランザクションを開始
      db.run('BEGIN TRANSACTION');
      
      // プリペアドステートメントを作成
      const stmt = db.prepare(`
        INSERT INTO records (
          id, artist, album_name, release_year, genre, country, size, 
          label, compilation, star, review, alphabet_artist, 
          music_link, acquisition_date, storage_location, catalog_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      // 各レコードをデータベースに挿入
      records.forEach(record => {
        stmt.run(
          record.id,
          record.artist,
          record.album_name,
          record.release_year,
          record.genre,
          record.country,
          record.size,
          record.label,
          record.compilation,
          record.star,
          record.review,
          record.alphabet_artist,
          record.music_link,
          record.acquisition_date,
          record.storage_location,
          record.catalog_number
        );
      });
      
      // ステートメントを完了
      stmt.finalize();
      
      // トランザクションをコミット
      db.run('COMMIT', err => {
        if (err) {
          console.error('データの挿入に失敗しました:', err);
        } else {
          console.log('データベースの初期化が完了しました。');
          console.log(`${records.length}件のレコードデータを挿入しました。`);
        }
        
        // データベース接続をクローズ
        db.close();
      });
    });
  });
}

// データベースの初期化を実行
initializeDatabase();
