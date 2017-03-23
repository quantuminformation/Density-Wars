module.exports = {
  plugins: [
    require('postcss-import')({/* ...options */}),
    require('postcss-custom-media')({/* ...options */}),
    require('postcss-css-variables')({/* ...options */}),
    require('postcss-nested')({/* ...options */}),
    require('autoprefixer')({ "browsers": "> 5%"})
  ]
}
