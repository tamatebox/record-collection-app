/**
 * データベースマイグレーションスクリプト
 * full_imageカラムを追加し、既存の画像ファイルからパスを設定します
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'records.db');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
    return;
  }
  console.log('データベースに接続しました');
});

// トランザクション内で処理
db.serialize(() => {
  // トランザクション開始
  db.run('BEGIN TRANSACTION');

  try {
    // full_imageカラムを追加
    db.run(`ALTER TABLE records ADD COLUMN full_image TEXT DEFAULT NULL`, (err) => {
      if (err && !err.message.includes('duplicate column')) {
        throw err;
      }
      console.log('full_image カラムを追加しました');
      
      // 全レコードのIDを取得して、画像パスを更新
      db.all('SELECT id FROM records', [], (err, rows) => {
        if (err) {
          throw err;
        }

        console.log(`${rows.length}件のレコードを処理します...`);

        // 各レコードのIDに対応する画像ファイルの存在を確認し、パスを設定
        let updateCount = 0;

        for (const row of rows) {
          const id = row.id;

          // フルサイズ画像のパス
          const fullImagePath = path.join(__dirname, '../', 'public', 'images', 'record-covers', 'full-size', `record_${id}_full.jpeg`);

          // 画像ファイルが存在する場合、データベースを更新
          const fullImageExists = fs.existsSync(fullImagePath);

          if (fullImageExists) {
            db.run(
              `UPDATE records SET full_image = ? WHERE id = ?`,
              [`/images/record-covers/full-size/record_${id}_full.jpeg`, id],
              function(err) {
                if (err) {
                  console.error(`ID ${id} の更新中にエラーが発生しました:`, err);
                } else if (this.changes > 0) {
                  updateCount++;
                  console.log(`ID ${id} の画像パスを更新しました`);
                }
              }
            );
          }
        }

        console.log(`${updateCount}件のレコードの画像パスを更新しました`);
      });
    });

    // トランザクションをコミット
    db.run('COMMIT', (err) => {
      if (err) {
        throw err;
      }
      console.log('データベーススキーマの更新が完了しました');

      // 接続を閉じる
      // 注意: 非同期処理があるため、すぐに閉じないようにする
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            console.error('データベース接続を閉じる際にエラーが発生しました:', err.message);
          }
          console.log('データベース接続を閉じました');
        });
      }, 1000);
    });
  } catch (error) {
    // エラーが発生した場合はロールバック
    db.run('ROLLBACK');
    console.error('エラーが発生したため、変更をロールバックしました:', error.message);

    // 接続を閉じる
    db.close((err) => {
      if (err) {
        console.error('データベース接続を閉じる際にエラーが発生しました:', err.message);
      }
    });
  }
});
