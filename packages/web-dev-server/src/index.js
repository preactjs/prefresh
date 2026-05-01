let babelLoaderPromise;

function loadBabel() {
  if (!babelLoaderPromise) {
    babelLoaderPromise = Promise.all([
      import('@babel/core'),
      import('@prefresh/babel-plugin'),
    ])
      .then(([babelMod, pluginMod]) => ({
        transformSync: (babelMod.default || babelMod).transformSync,
        plugin: pluginMod.default || pluginMod,
      }))
      .catch(err => {
        if (
          err &&
          (err.code === 'ERR_MODULE_NOT_FOUND' || err.code === 'MODULE_NOT_FOUND')
        ) {
          throw new Error(
            '@prefresh/web-dev-server requires @babel/core and @prefresh/babel-plugin. ' +
              'Install them as dev dependencies of your project.'
          );
        }
        throw err;
      });
  }
  return babelLoaderPromise;
}

export default function preactRefreshPlugin(config, pluginOptions) {
  return {
    async transform(context) {
      if (
        process.env.NODE_ENV === 'production' ||
        !context.response.is('js') ||
        context.path.includes('node_modules')
      )
        return;

      const { transformSync, plugin } = await loadBabel();
      const { code } = transformSync(context.body, {
        plugins: [[plugin, { skipEnvCheck: true }]],
        cwd: process.cwd(),
        ast: false,
        compact: false,
        sourceMaps: false,
        configFile: false,
        babelrc: false,
      });

      const hasRefeshReg = /\$RefreshReg\$\(/.test(code);
      const hasRefeshSig = /\$RefreshSig\$\(/.test(code);
      if (!hasRefeshReg && !hasRefeshSig) {
        return context;
      }

      return {
        ...context,
        body: `
          ${'import'} '@prefresh/web-dev-server/runtime';
          ${'import'} { flushUpdates } from '@prefresh/web-dev-server/utils';

          const prevRefreshReg = self.$RefreshReg$ || (() => {});
          const prevRefreshSig = self.$RefreshSig$ || (() => (type) => type);

          self.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
              return type;
            };
          };

          self.$RefreshReg$ = (type, id) => {
            let url = ${JSON.stringify(context.url)};
            if (url.includes('?')) {
              url = url.split('?')[0];
            }
            self.__PREFRESH__.register(type, url + " " + id);
          };

          ${code}

          ${
            hasRefeshReg &&
            `
          if (import.meta.hot) {
            self.$RefreshSig$ = prevRefreshSig;
            self.$RefreshReg$ = prevRefreshReg;
            import.meta.hot.accept(() => {
              try {
                flushUpdates();
              } catch(e) {
                import.meta.hot.invalidate();
              }
            });
          }
          `
          }

        `,
      };
    },
  };
}
