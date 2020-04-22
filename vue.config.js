module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    entry
      // .add('@/mock')
      .end()
  },
  devServer: {
    // 端口配置
    port: 1888,
    // 反向代理配置
    proxy: {
      '/api': {
        // target: 'http://47.103.39.115:88',
        // target: 'http://192.168.0.112:80', //h
        // target: 'http://192.168.0.113:80', //w
        // target: 'http://121.41.4.232:88', //w
        // target: 'http://192.168.137.1', //w
        // target: 'http://192.168.137.150', //w
        // target: 'http://192.168.191.3', //w
        // target: 'http://192.168.191.4', //w
        // target: 'http://192.168.0.117', //w
        // target: 'http://192.168.191.7', //w
        // target: 'http://192.168.43.124', //w
        // target: 'http://192.168.191.4', //w
        // target: 'http://172.28.162.99', //w
        // target: 'http://172.28.163.44', //w
        target: 'http://172.28.161.19', //w
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
