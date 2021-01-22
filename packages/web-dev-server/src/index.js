import babel from '@babel/core';
import plugin from '@prefresh/babel-plugin';

const { transformSync } = babel;

export default function preactRefreshPlugin(config, pluginOptions) {
  return {
    async transform(context) {
      if (
        process.env.NODE_ENV === 'production' ||
        !context.response.is('js') ||
        context.path.includes('node_modules')
      )
        return;

      const { code } = transform(context.body);

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

const transform = code =>
  transformSync(code, {
    plugins: [[plugin, { skipEnvCheck: true }]],
    cwd: process.cwd(),
    ast: false,
    compact: false,
    sourceMaps: false,
    configFile: false,
    babelrc: false,
  });
