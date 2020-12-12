const getWebpackConfig = require('ocular-dev-tools/config/webpack.config');

module.exports = env => {
  const config = getWebpackConfig(env);

  config.module.rules.push({
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
  });
  return config;
};
