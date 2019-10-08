module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // data: `@import "./src/lib/px2rem.scss";`
        data: '@import "./src/assets/style/main.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8889',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api', // rewrite path
          '^server': '/server'
        }
      }
    }
  },
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      lodash: {
        commonjs: 'lodash',
        umd: 'lodash',
        root: '_'
      }
    };
  }
};
