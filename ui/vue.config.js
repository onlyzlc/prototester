// const proxy = require('http-proxy-middleware');
const path = require("path",);
module.exports = {
  outputDir: "dist",

  devServer: {
    // open: true,
    host: "127.0.0.1",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
      },
    },
    contentBase: [path.resolve(__dirname, "static",), ],
  },

  pluginOptions: {
    svgSprite: {
      /*
        * The directory containing your SVG files.
        */
      dir: "src/assets/icons",
      /*
        * The reqex that will be used for the Webpack rule.
        */
      test: /\.(svg)(\?.*)?$/,
      /*
        * @see https://github.com/kisenka/svg-sprite-loader#configuration
        */
      loaderOptions: {
        extract: true,
        spriteFilename: "img/icons.[hash:8].svg", // or 'img/icons.svg' if filenameHashing == false
      },
      /*
        * @see https://github.com/kisenka/svg-sprite-loader#configuration
        */
      pluginOptions: {
        plainSprite: true,
      },
    },
  },

  chainWebpack: config => {
    config.module
      .rule("svg-sprite",)
      .use("svgo-loader",)
      .loader("svgo-loader",);
  },
};
