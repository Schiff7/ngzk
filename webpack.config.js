const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/javascripts/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    alias: {
      '@': `${__dirname}/src/`,
      'actions': `${__dirname}/src/javascripts/actions/`,
      'reducers': `${__dirname}/src/javascripts/reducers/`,
      'components': `${__dirname}/src/javascripts/components/`,
      'containers': `${__dirname}/src/javascripts/containers/`,
      'sagas': `${__dirname}/src/javascripts/sagas`,
      'utils': `${__dirname}/src/javascripts/utils/`,
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'src/javascripts')],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(styl|css)$/,
        use: [ 
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'stylus-loader'},
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: [path.resolve(__dirname, 'src/images')],
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
    port: 3000,
    contentBase: './public',
    hot: true,
    historyApiFallback: true, // react-router
  }
}