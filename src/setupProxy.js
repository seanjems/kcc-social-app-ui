const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Cross-Origin-Opener-Policy", "*");
    res.setHeader(
      "Cross-Origin-Embedder-Policy",
      "Origin, X-Requested-With, Content-Type, Accept,require-corp"
    );
    next();
  });
};
