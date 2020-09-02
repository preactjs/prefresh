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
			open: false,
			overlay: true
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/'
		},
		plugins: [
			new HtmlWebpackPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
			}),
			new PreactRefreshPlugin(),
			new webpack.HotModuleReplacementPlugin()
		],
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
