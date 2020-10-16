const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const resolve = require('path').resolve;

const config = {
  mode: 'development',

  entry: {
    app: resolve('./src/main.js')
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          plugins: ['@babel/plugin-proposal-class-properties'],
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new HtmlWebpackPlugin({title: 'hubble.gl kepler export example'}),
    // Optional: Enables reading mapbox token from environment variable
    new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  ]
};

module.exports = env => (env && env.local ? require('../webpack.config.local')(config) : config);
