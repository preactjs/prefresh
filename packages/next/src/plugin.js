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
		const ConstDependency = require('webpack/lib/dependencies/ConstDependency');

		const RuntimeGlobals = require('webpack/lib/RuntimeGlobals');
		const PrefreshRuntimeMOdule = require('./utils/Runtime');

		compiler.hooks.compilation.tap(
			NAME,
			(compilation, { normalModuleFactory }) => {
				if (compilation.compiler !== compiler) {
					return;
				}

				// Set template for ConstDependency which is used by parser hooks
				compilation.dependencyTemplates.set(
					ConstDependency,
					new ConstDependency.Template()
				);

				compilation.hooks.additionalTreeRuntimeRequirements.tap(
					this.constructor.name,
					// Setup react-refresh globals with a Webpack runtime module
					(chunk, runtimeRequirements) => {
						runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
						compilation.addRuntimeModule(chunk, new PrefreshRuntimeMOdule());
					}
				);

				normalModuleFactory.hooks.afterResolve.tap(
					this.constructor.name,
					// Add react-refresh loader to process files that matches specified criteria
					({ createData: data }) => {
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
					}
				);
			}
		);
	}

	apply(compiler) {
		if (
			process.env.NODE_ENV === 'production' ||
			compiler.options.mode === 'production'
		)
			return;

		compiler.options.entry = injectEntry(compiler.options.entry);

		const providePlugin = new webpack.ProvidePlugin({
			[prefreshUtils]: require.resolve('./utils/prefresh')
		});
		providePlugin.apply(compiler);

		switch (Number(webpack.version[0])) {
			case 4: {
				this.webpack4(compiler);
				break;
			}
			case 5: {
				this.webpack5(compiler);
				break;
			}
			default: {
				throw new Error('Unsupported webpack version.');
			}
		}
	}
}

module.exports = ReloadPlugin;
