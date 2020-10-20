// const proxy = require('http-proxy-middleware');
const path = require('path')
module.exports = {
  outputDir: 'dist',
  devServer: {
    open: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    },
    contentBase: [path.resolve(__dirname, 'static')]
  }
}
