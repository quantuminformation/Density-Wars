module.exports = {
  context: __dirname + "/lib",
  entry: {
    main: [
      "game.js"
    ]
  },
  output: {
    path: __dirname + "/dist",
    filename: "density-wars.js"
  },
  devtool: "#source-map",
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'typescript-loader'
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.json']
  }
}
