const express = require('express');
const router = express.Router();
const db = require('../config/database').initializeDatabase();

// すべてのレコードを取得する
router.get('/', (req, res) => {
  db.all('SELECT * FROM records', [], (err, rows) => {
    if (err) {
      console.error('クエリ実行エラー:', err);
      return res.status(500).json({ error: 'データ取得中にエラーが発生しました' });
    }
    res.json(rows);
  });
});

// IDによるレコードの取得
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM records WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('クエリ実行エラー:', err);
      return res.status(500).json({ error: 'データ取得中にエラーが発生しました' });
    }
    if (!row) {
      return res.status(404).json({ error: 'レコードが見つかりません' });
    }
    res.json(row);
  });
});

// 新しいレコードの追加
router.post('/', (req, res) => {
  const record = req.body;
  
  // IDの生成（最大のID + 1）
  db.get('SELECT MAX(CAST(id AS INTEGER)) as maxId FROM records', [], (err, row) => {
    if (err) {
      console.error('IDの生成中にエラーが発生しました:', err);
      return res.status(500).json({ error: 'レコードの追加に失敗しました' });
    }
    
    // 新しいID
    const newId = (row.maxId + 1).toString();
    
    // レコードの挿入
    const stmt = db.prepare(`
      INSERT INTO records (
        id, artist, album_name, release_year, genre, country, size, 
        label, compilation, star, review, alphabet_artist, 
        music_link, acquisition_date, storage_location, catalog_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      newId,
      record.artist,
      record.album_name,
      record.release_year,
      record.genre,
      record.country,
      record.size,
      record.label,
      record.compilation || 0,
      record.star,
      record.review,
      record.alphabet_artist,
      record.music_link,
      record.acquisition_date,
      record.storage_location,
      record.catalog_number,
      function(err) {
        if (err) {
          console.error('レコードの追加中にエラーが発生しました:', err);
          return res.status(500).json({ error: 'レコードの追加に失敗しました' });
        }
        
        // 追加されたレコードを返す
        db.get('SELECT * FROM records WHERE id = ?', [newId], (err, row) => {
          if (err) {
            console.error('追加されたレコードの取得中にエラーが発生しました:', err);
            return res.status(500).json({ error: 'レコードの追加は成功しましたが、データの取得に失敗しました' });
          }
          res.status(201).json(row);
        });
      }
    );
    
    stmt.finalize();
  });
});

// レコードの更新
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const record = req.body;
  
  const stmt = db.prepare(`
    UPDATE records SET
      artist = ?,
      album_name = ?,
      release_year = ?,
      genre = ?,
      country = ?,
      size = ?,
      label = ?,
      compilation = ?,
      star = ?,
      review = ?,
      alphabet_artist = ?,
      music_link = ?,
      acquisition_date = ?,
      storage_location = ?,
      catalog_number = ?
    WHERE id = ?
  `);
  
  stmt.run(
    record.artist,
    record.album_name,
    record.release_year,
    record.genre,
    record.country,
    record.size,
    record.label,
    record.compilation || 0,
    record.star,
    record.review,
    record.alphabet_artist,
    record.music_link,
    record.acquisition_date,
    record.storage_location,
    record.catalog_number,
    id,
    function(err) {
      if (err) {
        console.error('レコードの更新中にエラーが発生しました:', err);
        return res.status(500).json({ error: 'レコードの更新に失敗しました' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: '更新するレコードが見つかりません' });
      }
      
      // 更新されたレコードを返す
      db.get('SELECT * FROM records WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('更新されたレコードの取得中にエラーが発生しました:', err);
          return res.status(500).json({ error: 'レコードの更新は成功しましたが、データの取得に失敗しました' });
        }
        res.json(row);
      });
    }
  );
  
  stmt.finalize();
});

// レコードの削除
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM records WHERE id = ?', id, function(err) {
    if (err) {
      console.error('レコードの削除中にエラーが発生しました:', err);
      return res.status(500).json({ error: 'レコードの削除に失敗しました' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: '削除するレコードが見つかりません' });
    }
    
    res.json({ success: true, message: 'レコードが削除されました' });
  });
});

module.exports = router;
