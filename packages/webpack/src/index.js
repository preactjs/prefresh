const { createRefreshTemplate } = require('./createTemplate');
const { injectEntry } = require('./utils');

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
