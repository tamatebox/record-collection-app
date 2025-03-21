const express = require('express');
const router = express.Router();

// 各ルーターをインポート
const recordRoutes = require('./records');
const discogsRoutes = require('./discogs');

// ルートに各ルーターを登録
router.use('/records', recordRoutes);
router.use('/discogs', discogsRoutes);

module.exports = router;
