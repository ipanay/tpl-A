/*
开发环境配置
    运行项目指令：
    webpack 会将打包结果输出
    npm run webpack-dev-server在内存生成文件 没有输出
author：ipan
date：2020/03/18
*/
// 引用node路由模块
const { resolve } = require('path');
// 引入html-webpack-plugin模块打包html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

// webpack五大核心：
module.exports = {
  // 入口文件
  entry: './src/views/main.js',
  // 出口文件
  output: {
    // 出口文件名称
    filename: 'js/bundle.js', // 打包到bundle下的js文件夹下
    // 出口文件文件夹路径（不只是bundle.js文件 还有css、imgs等）
    path: resolve(__dirname, 'bundle'),
  },
  // 处理非js模块的loader
  module: {
    rules: [
      { // 引入vue-loader识别.vue文件
        test: /\.vue$/,
        use: [
          'vue-loader',
        ],
      },
      { // 处理css
        // 匹配文件类型
        test: /\.css$/,
        // 文件采用loader 从后往前
        use: ['style-loader', 'css-loader'],
        // css-loader讲css文件采用commonJs模块化到js中 需 npm i css-loader -D
        // style-loader在index.html创建style标签 并讲样式引入其中 需 npm i style-loader -D
      },
      { // 处理less
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        // less-loader 将less语法文件翻译为css文件 需 npm i less less-loader -D
      },
      { // 处理图片
        test: /\.jpeg|jpg|png|gif$/,
        loader: 'url-loader',
        // 处理图片 不能处理 html中引入的图片 需 引入 npm url-loader file-loader -D
        // url-loader是在file-loader的基础上加了base64的功能
        options: {
          limit: 8 * 1024, // 图片小于8KB的图片采用base64格式 减少请求次数 但是体积会变大
          esModule: false, // url-loader默认使用es6模块化解析 而html-loader是commonJs模块 为了统一 这里要关闭es6模块
          name: '[hash:10].[ext]', // 名称取hash前十位 ext以默认扩展名
          outputPath: 'imgs', // 将图片打包到bundle下的imgs下
        },
      },
      { // 处理html中img标签图片
        test: /\.html$/,
        // 处理html中img标签引入的图片
        loader: 'html-loader',
        options: {
          // limit: 8 * 1024,
          // name: '[hash:10].[ext]',
        },
      },
      { // 打包其他资源
        // exclude: /\.(css|js|html|less|jpg|png|gif)$/,
        test: /\.eot|svg|ttf|woff$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'iconfont',
        },
      },
      { // 语法检查： eslint-loader eslint
        // 注意： 只检查自己写的源代码 第三方的库不检查
        // npmjs.com eslint-config-airbnb-base
        // airbnb --> eslint-config-airbnb-base eslint eslint-plugin-import
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true, // 自动修复代码格式
        },
      },
      // js 兼容性处理：babel-loader @babel/core
      // 1.@babel/core @babel/preset-env
      //  只能转化基本语法： 如promise不能转换
      // 2. 全部js兼容性语法： @babel/polyfill
      //      问题： 本想解决部分兼容性 但他将所有兼容性代码全部引入
      // 3. 按需处理兼容性 --》 core.js
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader',
      //   options: {
      //     preset: [
      //       '@babel/preset-env',
      //       {
      //         useBuiltIns: 'usage', // 按需加载
      //         corejs: {
      //           version: 3,
      //         },
      //         targets: {
      //           chrome: '60',
      //           firefox: '60',
      //           ie: '9',
      //           safari: '10',
      //           edge: '17',
      //         },
      //       },
      //     ],
      //   },
      // },
    ],
  },
  plugins: [
    // htmlwepackplugin 创建一个以template所指引的文件为基础的html文件 自动引入打包的所有的资源
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: true, // 移除注释
        removeComments: true, // 移除换行
      },
    }),
    new VueLoaderPlugin(),
  ],
  // 模式：development(开发模式 方便代码调试)/production(生产模式 代码压缩)
  mode: 'development',
  // 开发服务器 devServer 用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  devServer: {
    contentBase: resolve(__dirname, 'bundle'),
    compress: true, // zip压缩
    open: true,
    port: 3000,
  },
};
