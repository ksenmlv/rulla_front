const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://rulla.pro',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '/api/v1', // Важно! /api/... → /api/v1/...
      },
      logLevel: 'debug', // Чтобы видеть в консоли, что прокси работает
    })
  );
};