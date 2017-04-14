const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
var WebpackBuildNotifierPlugin = require("webpack-build-notifier");

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, './client'),
  build: path.join(__dirname, './server/public')
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [{
            loader: 'awesome-typescript-loader'

          }]
        },
        {
          test: /\.p?css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1, url: false
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }
      ],
    },
    resolve: {
      // you can now require('file') instead of require('file.js')
      extensions: ['.ts', '.js', '.pcss']
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
        hash: true,
        filename: 'index.html',
        template: PATHS.app + '/index.html',
      }),
      new WebpackBuildNotifierPlugin({
        title: "My Project Webpack Build"
      }),
    ]
  },
]);


const productionConfig = merge([
  parts.loadImages({
    options: {
      name: '[name].[ext]',
    },
  }),
]);

const developmentConfig = merge([
  parts.loadImages(),

  /*  parts.devServer({
   // Customize host/port here if needed
   host: process.env.HOST,
   port: process.env.PORT,
   })*/
]);

module.exports = (env) => {
  if (env === 'production') {
    console.log('using prod config')
    return merge(commonConfig, productionConfig);
  }
  console.log('using dev')

  return merge(commonConfig, developmentConfig);
};
