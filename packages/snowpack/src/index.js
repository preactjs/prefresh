import { transformSync } from '@babel/core';
import prefreshBabelPlugin from '@prefresh/babel-plugin';

export default function preactRefreshPlugin(config, pluginOptions) {
  return {
    knownEntrypoints: [
      '@prefresh/snowpack/runtime',
      '@prefresh/snowpack/utils',
    ],
    async transform({ contents, urlPath, isDev, isSSR, id }) {
      if (
        isSSR ||
        !isDev ||
        !urlPath.endsWith('.js') ||
        config.devOptions.hmr === false
      )
        return;

      let hasRefeshReg = /\$RefreshReg\$\(/.test(contents);
      let hasRefeshSig = /\$RefreshSig\$\(/.test(contents);

      if (!hasRefeshReg && !hasRefeshSig) {
        const { code } = transform(contents, id);
        contents = code;

        hasRefeshReg = /\$RefreshReg\$\(/.test(contents);
        hasRefeshSig = /\$RefreshSig\$\(/.test(contents);
        if (!hasRefeshReg && !hasRefeshSig) {
          return { contents };
        }
      }

      return {
        result: `
          ${'import'} '@prefresh/snowpack/runtime';
          ${'import'} { flushUpdates } from '@prefresh/snowpack/utils';

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
            self.__PREFRESH__.register(type, ${JSON.stringify(
              urlPath
            )} + " " + id);
          };

          ${contents}

          self.$RefreshSig$ = prevRefreshSig;
          self.$RefreshReg$ = prevRefreshReg;

          ${
            hasRefeshReg &&
            `
          if (import.meta.hot) {
            import.meta.hot.accept(({ module }) => {
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

const transform = (code, id) =>
  transformSync(code, {
    plugins: [
      [prefreshBabelPlugin, { skipEnvCheck: true }],
      [require('@babel/plugin-syntax-class-properties')],
    ],
    cwd: process.cwd(),
    filename: id,
    ast: false,
    compact: false,
    sourceMaps: false,
    configFile: false,
    babelrc: false,
  });
