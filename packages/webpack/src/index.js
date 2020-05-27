const webpack = require('webpack');
const path = require('path');
const { createRefreshTemplate } = require('./utils/createTemplate');
const { injectEntry } = require('./utils/injectEntry');
const {
	prefreshUtils,
	HMR_PLUGIN,
	NAME,
	options
} = require('./utils/constants');

class ReloadPlugin {
	apply(compiler) {
		if (
			process.env.NODE_ENV === 'production' ||
			compiler.options.mode === 'production'
		)
			return;

		compiler.options.entry = injectEntry(compiler.options.entry);

		compiler.hooks.beforeRun.tap(this.constructor.name, compiler => {
			if (
				!compiler.options.plugins ||
				!compiler.options.plugins.find(
					plugin => plugin.constructor.name === HMR_PLUGIN
				)
			) {
				throw new Error(
					'Webpack.HotModuleReplacementPlugin is missing from the webpack config.'
				);
			}
		});

		const providePlugin = new webpack.ProvidePlugin({
			[prefreshUtils]: require.resolve('./utils/prefresh')
		});
		providePlugin.apply(compiler);

		const matcher = webpack.ModuleFilenameHelpers.matchObject.bind(
			undefined,
			options
		);

		compiler.hooks.normalModuleFactory.tap(NAME, nmf => {
			nmf.hooks.afterResolve.tap(NAME, data => {
				if (
					matcher(data.resource) &&
					!data.resource.includes('@prefresh') &&
					!data.resource.includes(path.join(__dirname, './loader')) &&
					!data.resource.includes(path.join(__dirname, './utils'))
				) {
					data.loaders.unshift({
						loader: require.resolve('./loader'),
						options: undefined
					});
				}

				return data;
			});
		});

		compiler.hooks.compilation.tap(NAME, compilation => {
			compilation.mainTemplate.hooks.require.tap(NAME, (source, chunk, hash) =>
				createRefreshTemplate(source, chunk, hash, compilation.mainTemplate)
			);
		});
	}
}

module.exports = ReloadPlugin;
