// const proxy = require('http-proxy-middleware');
const path = require('path')
module.exports = {
  outputDir: 'dist',
  devServer: {
    // open: true,
    host: '127.0.0.1',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true
      }
    },
    contentBase: [path.resolve(__dirname, 'static')]
  }
}
