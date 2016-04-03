module.exports = {
  context: __dirname + "/lib",
  entry: {
    main: [
      "./game.ts"
    ]
  },
  output: {
    path: __dirname + "/dist",
    filename: "density-wars.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json', '.ts']
  }
}
