const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreactRefreshPlugin = require('@prefresh/webpack');

const makeConfig = () => {
	return {
		mode: 'development',
		entry: './src/index.js',
		stats: 'minimal',
		devServer: {
			contentBase: path.join(__dirname, 'dist'),
			host: 'localhost',
			port: 3001,
			historyApiFallback: true,
			hot: true,
			inline: true,
			publicPath: '/',
			clientLogLevel: 'none',
			open: false
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/'
		},
		plugins: [
			new HtmlWebpackPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			new PreactRefreshPlugin()
    ],
    resolve: {
      alias: {
        preact: path.resolve(__dirname, 'node_modules/preact/'),
      }
    },
		module: {
			rules: [
				{
					test: /\.js$|\.jsx$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				}
			]
		}
	};
};

module.exports = makeConfig();
