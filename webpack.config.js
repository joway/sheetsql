const path = require('path')

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './dist/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sheetsql.min.js',
    libraryTarget: 'umd',
  },
}
