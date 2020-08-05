const webpack = require('webpack');
const path = require('path');
const { createRefreshTemplate } = require('./utils/createTemplate');
const { injectEntry } = require('./utils/injectEntry');
const { prefreshUtils, NAME, options } = require('./utils/constants');

const matcher = webpack.ModuleFilenameHelpers.matchObject.bind(
	undefined,
	options
);

class ReloadPlugin {
	webpack4(compiler) {
		compiler.options.entry = injectEntry(compiler.options.entry);

		const providePlugin = new webpack.ProvidePlugin({
			[prefreshUtils]: require.resolve('./utils/prefresh')
		});
		providePlugin.apply(compiler);

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
			compilation.mainTemplate.hooks.require.tap(NAME, source =>
				createRefreshTemplate(source)
			);
		});
	}

	webpack5(compiler) {
		class PrefreshRuntimeModule extends webpack.RuntimeModule {
			constructor() {
				super(NAME, 5);
			}

			generate() {
				// This is the part I don't understand anymore.... Yikes
			}
		}

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
			});
		});

		compiler.hooks.compilation.tap(NAME, compilation => {
			const hookVars = compilation.mainTemplate.hooks.localVars;

			hookVars.tap(NAME, source =>
				webpack.Template.asString([
					source,
					'',
					'if (typeof self !== "undefined") {',
					webpack.Template.indent('self.$RefreshReg$ = function () {};'),
					webpack.Template.indent('self.$RefreshSig$ = function () {'),
					webpack.Template.indent(
						webpack.Template.indent('return function (type) {')
					),
					webpack.Template.indent(
						webpack.Template.indent(webpack.Template.indent('return type;'))
					),
					webpack.Template.indent(webpack.Template.indent('};')),
					webpack.Template.indent('};'),
					'}'
				])
			);

			// @ts-ignore Exists in webpack 5
			compilation.hooks.additionalTreeRuntimeRequirements.tap(NAME, chunk => {
				// @ts-ignore Exists in webpack 5
				compilation.addRuntimeModule(chunk, new PrefreshRuntimeModule());
			});
		});
	}

	apply(compiler) {
		if (
			process.env.NODE_ENV === 'production' ||
			compiler.options.mode === 'production'
		)
			return;

		switch (webpack.version) {
			case 4: {
				this.webpack4(compiler);
				break;
			}
			case 5: {
				this.webpack5(compiler);
				break;
			}
		}
	}
}

module.exports = ReloadPlugin;
