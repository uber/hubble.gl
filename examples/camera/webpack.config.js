const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = {
  mode: 'development',

  entry: {
    index: './index.js'
  },

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
      },
      {
        test: /\.js$/,
        loader: '@open-wc/webpack-import-meta-loader',
      }
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new HtmlWebpackPlugin({title: 'hubble.gl deck camera example'}),
    // Optional: Enables reading mapbox token from environment variable
    new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  ]
};

module.exports = env => (env && env.local ? require('../webpack.config.local')(config) : config);
