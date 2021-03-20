const Prefresh = require('./plugin');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { dev, isServer, defaultLoaders } = options;
      if (dev && !isServer) {
        const reactRefresh = config.plugins.find(
          s => s.constructor.name === 'ReactFreshWebpackPlugin'
        );

        const prefreshLoader = require.resolve(
          '@prefresh/next/src/loader/index.js'
        );
        config.module.rules.forEach(mod => {
          // Explore loaders and add ours
          if (mod.use && Array.isArray(mod.use)) {
            const idx = mod.use.findIndex(rule =>
              rule.includes('react-refresh-utils')
            );
            if (idx !== -1) mod.use.splice(idx, 1, prefreshLoader);
          }
        });

        if (reactRefresh) {
          config.plugins.splice(config.plugins.indexOf(reactRefresh), 1);
        }

        config.plugins.unshift(new Prefresh());

        defaultLoaders.babel.options.plugins = [].slice.call(
          defaultLoaders.babel.options.plugins || []
        );

        defaultLoaders.babel.options.plugins.push([
          require.resolve('@prefresh/babel-plugin'),
          { skipEnvCheck: true },
        ]);

        defaultLoaders.babel.options.hasReactRefresh = false;
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
