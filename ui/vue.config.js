// const proxy = require('http-proxy-middleware');

module.exports = {
  outputDir: '../public',
  devServer: {
    // host: 'localhost',//target host
    // port: 8080,
    proxy:{
      '': {
        target: 'localhost:8081',//代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
      }
    }
    // proxy:{
    //     '':{
    //         target: 'http://localhost:8081',//代理地址，这里设置的地址会代替axios中设置的baseURL
    //         changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
    //        }
    // }}
  }
}
