const express = require('express');
const router = express.Router();
const db = require('../config/database').initializeDatabase();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

// 画像アップロード用のストレージ設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images/record-covers/full-size'));
  },
  filename: function (req, file, cb) {
    // ファイル名はレコードIDを基にする
    // リクエストパラメータまたはフォームデータからIDを取得
    let id;
    if (req.params.id) {
      id = req.params.id;
    } else {
      // 新規追加の場合、一時的なファイル名を使用し、後でリネーム
      id = `temp_${Date.now()}`;
    }

    // 拡張子を取得
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `record_${id}_full${ext}`);
  }
});

// ファイルアップロードの制限
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    // 画像ファイルのみ許可
    const allowedTypes = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(ext);

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error('許可されていないファイル形式です。JPEG、JPG、またはPNG形式の画像のみアップロードできます。'));
  }
});

// 画像URLからファイルをダウンロードする関数
async function downloadImage(imageUrl, recordId) {
  try {
    // ディレクトリのパス
    const fullSizeDir = path.join(__dirname, '../../public/images/record-covers/full-size');

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(fullSizeDir)) {
      fs.mkdirSync(fullSizeDir, { recursive: true });
    }
    // ファイルパス
    const fullImagePath = path.join(fullSizeDir, `record_${recordId}_full.jpeg`);

    // 画像のダウンロード
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    // フルサイズ画像の保存
    fs.writeFileSync(fullImagePath, response.data);

    return {
      fullImagePath: `/images/record-covers/full-size/record_${recordId}_full.jpeg`,
    };
  } catch (error) {
    console.error('画像ダウンロード中にエラーが発生しました:', error);
    throw error;
  }
}

// サムネイル関連の処理は削除します

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

// 新しいレコードの追加（画像アップロード対応）
router.post('/', upload.single('coverImage'), async (req, res) => {
  try {
    // フォームデータからJSONデータを取得
    let record;
    if (req.body.data) {
      record = JSON.parse(req.body.data);
    } else {
      record = req.body;
    }

    // IDの生成（最大のID + 1）
    db.get('SELECT MAX(CAST(id AS INTEGER)) as maxId FROM records', [], async (err, row) => {
      if (err) {
        console.error('IDの生成中にエラーが発生しました:', err);
        return res.status(500).json({ error: 'レコードの追加に失敗しました' });
      }

      // 新しいID
      const newId = (row.maxId + 1).toString();
      let imagePath = null;

      // ファイルアップロードの処理
      if (req.file) {
        // アップロードされたファイルのリネーム（一時的なファイル名から正式なファイル名へ）
        const originalPath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const newPath = path.join(
          path.dirname(originalPath),
          `record_${newId}_full${ext}`
        );

        fs.renameSync(originalPath, newPath);

        // サムネイルの作成は不要

        imagePath = `/images/record-covers/full-size/record_${newId}_full${ext}`;
      }
      // URL経由の画像ダウンロード処理
      else if (req.body.coverImageUrl) {
        try {
          const result = await downloadImage(req.body.coverImageUrl, newId);
          imagePath = result.fullImagePath;
        } catch (error) {
          console.error('画像ダウンロード中にエラーが発生しました:', error);
          // エラーがあっても処理は続行する
        }
      }

      // レコードの挿入
      const stmt = db.prepare(`
        INSERT INTO records (
          id, artist, album_name, release_year, genre, country, size,
          label, compilation, star, review, alphabet_artist,
          music_link, acquisition_date, storage_location, catalog_number,
          discogs_id, full_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        record.discogsId,
        imagePath,
        function (err) {
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
  } catch (error) {
    console.error('レコード追加処理中にエラーが発生しました:', error);
    res.status(500).json({ error: 'レコードの追加に失敗しました' });
  }
});

// レコードの更新（画像アップロード対応）
router.put('/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const id = req.params.id;

    // フォームデータからJSONデータを取得
    let record;
    if (req.body.data) {
      record = JSON.parse(req.body.data);
    } else {
      record = req.body;
    }

    let imagePath = null;

    // ファイルアップロードの処理
    if (req.file) {
      // サムネイルの作成

      imagePath = `/images/record-covers/full-size/record_${id}_full${path.extname(req.file.originalname).toLowerCase()}`;
    }
    // URL経由の画像ダウンロード処理
    else if (req.body.coverImageUrl) {
      try {
        const result = await downloadImage(req.body.coverImageUrl, id);
        imagePath = result.fullImagePath;
      } catch (error) {
        console.error('画像ダウンロード中にエラーが発生しました:', error);
        // エラーがあっても処理は続行する
      }
    }

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
        catalog_number = ?,
        discogs_id = ?
        ${imagePath ? ', full_image = ?' : ''}
      WHERE id = ?
    `);

    const params = [
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
      record.discogsId
    ];

    if (imagePath) params.push(imagePath);
    params.push(id);

    stmt.run(params, function (err) {
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
    });

    stmt.finalize();
  } catch (error) {
    console.error('レコード更新処理中にエラーが発生しました:', error);
    res.status(500).json({ error: 'レコードの更新に失敗しました' });
  }
});

// レコードの削除
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  // 画像の削除処理を追加
  db.get('SELECT full_image FROM records WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('レコード情報の取得中にエラーが発生しました:', err);
    } else if (row) {
      // 画像ファイルの削除
      if (row.full_image) {
        const fullImagePath = path.join(__dirname, '../..', 'public', row.full_image.replace(/^\/images/, ''));
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
        }
      }
      // サムネイル画像は使用しないので削除処理も不要
    }

    // レコードの削除
    db.run('DELETE FROM records WHERE id = ?', id, function (err) {
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
});

module.exports = router;
