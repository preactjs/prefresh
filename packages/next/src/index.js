const Prefresh = require('./plugin');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

      const { dev, isServer, defaultLoaders } = options;
      if (dev && !isServer) {
        const reactRefresh = config.plugins.find(
          s => s.constructor.name === 'ReactFreshWebpackPlugin'
        );

        const prefreshLoader = require.resolve(
          '@prefresh/next/src/loader/index.js'
        );
        const loader =
          config.module &&
          config.module.rules.forEach(mod => {
            // Explore loaders and add ours
            if (Array.isArray(mod.rule.use)) {
              const idx = mod.rule.use.findIndex(rule =>
                rule.includes('react-refresh-utils')
              );

              if (idx !== -1) mod.rule.use.splice(idx, 1, loader);
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

      return config;
    },
  });
};
