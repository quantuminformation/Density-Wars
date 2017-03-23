const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, './client'),
  build: path.join(__dirname, './server/public')
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app + '/Game.ts'
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    devtool: "source-map",
    module: {
      loaders: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.pcss$/,
          loaders: [
            'style-loader',
            'css-loader?importLoaders=1',
            'postcss-loader'
          ]
        },
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },

    resolve: {
      // you can now require('file') instead of require('file.js')
      extensions: ['.js', '.json', '.pcss']
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
        hash: true,
        filename: 'index.html',
        template: PATHS.app + '/index.html',
      })
    ]
  },
]);


const productionConfig = merge([
  parts.loadImages({
    options: {
      limit: 15000,
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
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};
