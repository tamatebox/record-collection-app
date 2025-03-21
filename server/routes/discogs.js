const express = require('express');
const axios = require('axios');
const router = express.Router();

// Discogs API基本設定
const DISCOGS_API_BASE = 'https://api.discogs.com';
const PERSONAL_ACCESS_TOKEN = process.env.DISCOGS_PERSONAL_ACCESS_TOKEN;

// APIキーの検証
const validateApiKeys = () => {
  const { DISCOGS_CONSUMER_KEY, DISCOGS_CONSUMER_SECRET } = process.env;

  if (!DISCOGS_CONSUMER_KEY || !DISCOGS_CONSUMER_SECRET ||
      DISCOGS_CONSUMER_KEY === 'your_consumer_key' ||
      DISCOGS_CONSUMER_SECRET === 'your_consumer_secret') {
    throw new Error('DiscogsのAPIキーが正しく設定されていません。環境変数を確認してください。');
  }
};

// リクエストからトークンを取得
const getTokenFromRequest = (req) => {
  // 優先順位:
  // 1. セッションからのトークン
  // 2. 環境変数のパーソナルアクセストークン

  // セッションからトークンを取得
  if (req.session && req.session.accessToken) {
    return req.session.accessToken;
  }

  // 環境変数のパーソナルアクセストークンを使用
  if (PERSONAL_ACCESS_TOKEN && PERSONAL_ACCESS_TOKEN !== 'your_personal_access_token') {
    return PERSONAL_ACCESS_TOKEN;
  }

  return null;
};

// エラーハンドリングミドルウェア
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ユーザー情報取得エンドポイント
router.get('/identity', asyncHandler(async (req, res) => {
  const accessToken = getTokenFromRequest(req);

  if (!accessToken) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  const response = await axios.get(`${DISCOGS_API_BASE}/oauth/identity`, {
    headers: {
      'Authorization': `Discogs token=${accessToken}`,    }
  });

  res.json(response.data);
}));

// トークン取得エンドポイント
router.get('/token', (req, res) => {
  if (!PERSONAL_ACCESS_TOKEN || PERSONAL_ACCESS_TOKEN === 'your_personal_access_token') {
    return res.status(500).json({
      error: 'トークンが設定されていません',
      details: '環境変数 DISCOGS_PERSONAL_ACCESS_TOKEN を確認してください'
    });
  }

  // セッションにトークンを保存
  if (req.session) {
    req.session.accessToken = PERSONAL_ACCESS_TOKEN;
  }

  res.json({
    accessToken: PERSONAL_ACCESS_TOKEN
  });
});

// 自動アクセストークン取得エンドポイント(不要になりましたが互換性のため残しています)
router.get('/auto-token', (req, res) => {
  res.redirect('/api/discogs/token');
});

// 注: 手動認証関連のエンドポイントは無効化されています
// アクセストークンの取得
router.post('/access-token', (req, res) => {
  res.status(403).json({
    error: '認証方法が変更されました',
    details: 'このアプリケーションは自動認証のみを使用します'
  });
});

// 認証URL生成エンドポイント
router.get('/authorize-url', (req, res) => {
  res.status(403).json({
    error: '認証方法が変更されました',
    details: 'このアプリケーションは自動認証のみを使用します'
  });
});

// 検索エンドポイント
router.get('/search', asyncHandler(async (req, res) => {
  const { query, type = 'release', perPage = 10 } = req.query;
  const accessToken = getTokenFromRequest(req);

  if (!query) {
    return res.status(400).json({ error: '検索クエリが必要です' });
  }

  if (!accessToken) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  const response = await axios.get(`${DISCOGS_API_BASE}/database/search`, {
    params: {
      q: query,
      type: type,
      per_page: perPage
    },
    headers: {
      'Authorization': `Discogs token=${accessToken}`,
      'User-Agent': 'RecordCollectionApp/1.0'
    }
  });

  // 検索結果を整形
  const formattedResults = response.data.results.map(result => ({
    id: result.id,
    title: result.title,
    type: result.type,
    year: result.year,
    country: result.country,
    genre: result.genre ? result.genre[0] : null,
    style: result.style ? result.style[0] : null,
    label: result.label ? result.label[0] : null,
    catno: result.catno ? result.catno : null,
    coverImage: result.cover_image,
    resourceUrl: result.resource_url
  }));

  res.json({
    results: formattedResults,
    pagination: response.data.pagination
  });
}));

// リリース詳細取得エンドポイント
router.get('/release/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const accessToken = getTokenFromRequest(req);

  if (!id) {
    return res.status(400).json({ error: 'リリースIDが必要です' });
  }

  if (!accessToken) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  const response = await axios.get(`${DISCOGS_API_BASE}/releases/${id}`, {
    headers: {
      'Authorization': `Discogs token=${accessToken}`,
      'User-Agent': 'RecordCollectionApp/1.0'
    }
  });

  // リリース詳細を整形
  const releaseDetails = response.data;
  const formattedRelease = {
    id: releaseDetails.id,
    title: releaseDetails.title,
    artists: releaseDetails.artists.map(artist => ({
      name: artist.name,
      id: artist.id,
      resourceUrl: artist.resource_url
    })),
    year: releaseDetails.year,
    genres: releaseDetails.genres,
    styles: releaseDetails.styles,
    country: releaseDetails.country,
    labels: releaseDetails.labels.map(label => ({
      name: label.name,
      catno: label.catno,
      id: label.id,
      resourceUrl: label.resource_url
    })),
    formats: releaseDetails.formats.map(format => ({
      name: format.name,
      qty: format.qty,
      descriptions: format.descriptions
    })),
    tracklist: releaseDetails.tracklist.map(track => ({
      position: track.position,
      title: track.title,
      duration: track.duration
    })),
    notes: releaseDetails.notes,
    images: releaseDetails.images,
    resourceUrl: releaseDetails.resource_url
  };

  res.json(formattedRelease);
}));

// トークン検証エンドポイント
router.get('/validate-token', asyncHandler(async (req, res) => {
  const accessToken = getTokenFromRequest(req);

  if (!accessToken) {
    return res.status(401).json({
      valid: false,
      error: 'トークンがありません'
    });
  }

  try {
    await axios.get(`${DISCOGS_API_BASE}/oauth/identity`, {
      headers: {
        'Authorization': `Discogs token=${accessToken}`,
        'User-Agent': 'RecordCollectionApp/1.0'
      }
    });

    res.json({ valid: true });
  } catch (error) {
    // トークンが無効な場合はセッションから削除
    if (req.session) {
      delete req.session.accessToken;
    }

    res.status(401).json({
      valid: false,
      error: 'トークンが無効です',
      details: error.response ? error.response.data : error.message
    });
  }
}));

// ログアウト（トークンの削除）
router.post('/logout', (req, res) => {
  if (req.session) {
    delete req.session.accessToken;
  }

  res.json({ success: true, message: 'ログアウトしました' });
});

module.exports = router;
