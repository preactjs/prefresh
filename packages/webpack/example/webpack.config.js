const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreactRefreshPlugin = require('@prefresh/webpack');

module.exports = (env) => {
  const { NODE_ENV = 'development' } = env;
  const isProduction = NODE_ENV === 'production';

  const plugins = [
    new HtmlWebpackPlugin(),
  ];
  if (!isProduction) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new PreactRefreshPlugin());
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    devServer: {
      hot: true,
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
        },
      ],
    },
  };
};
