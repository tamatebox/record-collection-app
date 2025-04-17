const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

module.exports = function (app) {
  // APIリクエスト用のプロキシ
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
    })
  );
};
