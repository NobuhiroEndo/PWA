const path = require('path');
const webpack = require('webpack');

const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 修正点
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintBareWebpackPlugin = require('stylelint-bare-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 修正点
const WorkboxPlugin = require('workbox-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const isLocal = process.env.NODE_PHASE === 'local';
const isDock = process.env.SYSTEM_TYPE === 'dock';

const cMapsDir = path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'cmaps',
);
const standardFontsDir = path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'standard_fonts',
);

module.exports = {
  entry: {
    main: isDock ? './src/app/main_ope.js' : './src/app/main.js',
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, './dist'),
    filename: isLocal
      ? 'js/[name].dev.bundle.js'
      : 'js/[name].[hash].bundle.js',
    chunkFilename: isLocal
      ? 'js/[name].dev.bundle.js'
      : 'js/[name].[hash].bundle.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader', // inject CSS to page
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
          },
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              postcssOptions: {
                plugins: [
                  require('precss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: false,
                quietDeps: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
        include: /node_modules/,
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',
    port: 8089,
    disableHostCheck: true,
    overlay: true,
    quiet: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8010', // ローカルサーバーのURL
    //     changeOrigin: true,
    //     pathRewrite: {'^/api': ''},
    //   },
    // },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_PHASE': JSON.stringify(
        process.env.NODE_PHASE ? process.env.NODE_PHASE : 'local',
      ),
      'process.env.SYSTEM_TYPE': JSON.stringify(isDock ? 'dock' : 'web'),
    }),
    new CleanWebpackPlugin(), // 修正点
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      favicon: path.resolve(
        __dirname,
        'src/img',
        isDock ? 'dwi_favicon-dock.ico' : 'favicon.ico',
      ),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new Dotenv(),
    // new ESLintWebpackPlugin({
    //   extensions: ['js', 'jsx'],
    // }),
    // new StylelintBareWebpackPlugin({
    //   configFile: '.stylelintrc.js',
    //   files: ['./src/**/*.css'],
    // }),
    new FriendlyErrorsWebpackPlugin(),
    new CopyWebpackPlugin([
        { from: cMapsDir, to: 'cmaps/' },
        { from: standardFontsDir, to: 'standard_fonts/' },
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' },
        { from: 'src/serviceworker.js', to: 'serviceworker.js' },
        // { from: 'src/firebase-messaging-sw.js', to: 'firebase-messaging-sw.js' },
    ]),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      // 必要に応じて他の設定も追加できます
    }),
  ],
  optimization: {
    splitChunks: { name: 'vendor', chunks: 'initial' },
  },
};

if(process.env.NODE_PHASE !== 'production') {
  module.exports.devtool = isLocal ? 'eval-source-map' : 'source-map';
}