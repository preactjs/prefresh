const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreactRefreshPlugin = require('@prefresh/webpack');

const makeConfig = () => {
	const { NODE_ENV } = process.env;
	const isProduction = NODE_ENV === 'production';

	// Build plugins
	const plugins = [
		new HtmlWebpackPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
		})
	];

	// Return configuration
	return {
		mode: 'development',
		entry: './src/index.js',
		stats: 'normal',
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
		resolve: {
			alias: {
				preact: path.resolve(__dirname, 'node_modules', 'preact')
			}
		},
		plugins,
		module: {
			rules: [
				{
					test: /\.js$|\.jsx$/,
					include: [path.resolve(__dirname, 'src')],
					loader: 'babel-loader'
				}
			]
		}
	};
};

module.exports = makeConfig();
