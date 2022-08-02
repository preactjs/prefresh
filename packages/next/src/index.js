import Prefresh from '@prefresh/webpack';

export default function prefreshNextPlugin(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!Prefresh.supportsNextJs) {
        throw new Error(
          'The version of @prefresh/webpack installed is not supported with next.js, please upgrade!'
        );
      }

      const { dev, isServer, defaultLoaders } = options;
      if (dev && !isServer) {
        const reactRefresh = config.plugins.find(
          s => s.constructor.name === 'ReactFreshWebpackPlugin'
        );

        if (reactRefresh) {
          config.plugins.splice(config.plugins.indexOf(reactRefresh), 1);
        }

        config.plugins.unshift(new Prefresh({ runsInNextJs: true }));

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
}
