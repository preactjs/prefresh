const Prefresh = require('./plugin');

module.exports = (nextConfig = {}) => {
	return Object.assign({}, nextConfig, {
		webpack(config, options) {
			const { dev, isServer, defaultLoaders } = options;
			if (dev && !isServer) {
				const reactRefresh = config.plugins.find(
					s => s.constructor.name === 'ReactFreshWebpackPlugin'
				);

				if (reactRefresh) {
					config.plugins.splice(config.plugins.indexOf(reactRefresh), 1);
				}

				config.plugins.unshift(new Prefresh());

				const copyLoader = { ...defaultLoaders.babel };
				const copyLoaderOptions = { ...defaultLoaders.babel.options };

				defaultLoaders.babel.options.plugins = [].slice.call(
					defaultLoaders.babel.options.plugins || []
				);
				defaultLoaders.babel.options.plugins.push(
					require.resolve('@prefresh/plugin-babel')
				);
				defaultLoaders.babel.options.hasReactRefresh = false;

				// This prevents the overrides above from affecting the server:
				copyLoader.options = copyLoaderOptions;
				defaultLoaders.babel = copyLoader;
			}

			if (typeof nextConfig.webpack === 'function') {
				return nextConfig.webpack(config, options);
			}

			return config;
		}
	});
};
