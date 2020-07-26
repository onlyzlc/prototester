// const proxy = require('http-proxy-middleware');

module.exports = {
  outputDir: 'dist',
  devServer: {
    open: true,
    port: 8080,
    proxy:{
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
}
