// const proxy = require('http-proxy-middleware');

module.exports = {
  outputDir: 'dist',
  devServer: {
    proxy:{
      '/api': {
        target: 'localhost:8081/api',//代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
      }
    }
  }
}
