const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

module.exports = function(app) {
  console.log('Proxy Target:', BACKEND_URL);

  // APIリクエスト用のプロキシ
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
    })
  );
};
