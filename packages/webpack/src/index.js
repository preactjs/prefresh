const webpack = require('webpack');
const { createRefreshTemplate } = require('./createTemplate');
const { injectEntry } = require('./utils');

const options = {
	include: /\.([jt]sx?|flow)$/,
	exclude: /node_modules/
};

const HMR_PLUGIN = 'HotModuleReplacementPlugin';

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

		const matchObject = webpack.ModuleFilenameHelpers.matchObject.bind(
			undefined,
			options
		);
		compiler.hooks.normalModuleFactory.tap(this.constructor.name, nmf => {
			nmf.hooks.afterResolve.tap(this.constructor.name, data => {
				// Inject refresh loader to all JavaScript-like files
				if (
					matchObject(data.resource) &&
					!data.resource.includes('@prefresh')
				) {
					data.loaders.unshift({
						loader: require.resolve('./loader'),
						options: undefined
					});
				}

				return data;
			});
		});

		compiler.hooks.compilation.tap(this.constructor.name, compilation => {
			compilation.mainTemplate.hooks.require.tap(
				this.constructor.name,
				(source, chunk, hash) =>
					createRefreshTemplate(source, chunk, hash, compilation.mainTemplate)
			);
		});
	}
}

module.exports = ReloadPlugin;
