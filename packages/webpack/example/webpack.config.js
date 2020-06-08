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

	if (!isProduction) {
		plugins.push(new PreactRefreshPlugin());
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	// Return configuration
	return {
		mode: isProduction ? 'production' : 'development',
		entry: './src/index.js',
		stats: 'normal',
		devServer: {
			contentBase: path.join(__dirname, 'dist'),
			host: 'localhost',
			port: 3000,
			historyApiFallback: true,
			hot: true,
			inline: true,
			publicPath: '/',
			clientLogLevel: 'none',
			open: true,
			overlay: true
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/'
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
