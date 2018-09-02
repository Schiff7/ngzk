const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './public/src/javascripts/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'public/src/javascripts')],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.styl$/,
        include: [path.resolve(__dirname, 'public/src/stylesheets')],
        use: [ 
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'stylus-loader'},
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './public/dist',
    hot: true
  }
}