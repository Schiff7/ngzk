const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './public/src/javascripts/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  resolve: {
    alias: {
      '@': `${__dirname}/public/src/`,
      'actions': `${__dirname}/public/src/javascripts/actions/`,
      'reducers': `${__dirname}/public/src/javascripts/reducers/`,
      'components': `${__dirname}/public/src/javascripts/components/`,
      'containers': `${__dirname}/public/src/javascripts/containers/`,
      'utils': `${__dirname}/public/src/javascripts/utils/`,
    }
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
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: [path.resolve(__dirname, 'public/src/images')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './public/dist',
    hot: true,
    historyApiFallback: true, // react-router
  }
}