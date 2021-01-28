import { transformSync } from '@babel/core';

const runtimePaths = ['@prefresh/vite/runtime', '@prefresh/vite/utils'];

/** @returns {import('vite').Plugin} */
export default function prefreshPlugin() {
  let shouldSkip = false;
  return {
    name: 'prefresh',
    config() {
      return {
        optimizeDeps: {
          exclude: [
            '@prefresh/vite/runtime',
            '@prefresh/vite/utils'
          ]
        }
      }
    },
    configResolved(config) {
      shouldSkip = config.command === 'build' || config.isProduction;
    },
    resolveId(id) {
      if (runtimePaths.includes(id)) {
        return id;
      }
    },
    load(id) {
      if (runtimePaths.includes(id)) {
        return runtimeCode;
      }
    },
    transform(code, id) {
      if (shouldSkip || !/\.(t|j)sx?$/.test(id) || id.includes('node_modules'))
        return;

      const result = transform(code, id);
      const hasReg = /\$RefreshReg\$\(/.test(result.code);
      const hasSig = /\$RefreshSig\$\(/.test(result.code);

      if (!hasSig && !hasReg) return code;

      const prelude = `
        ${'import'} '@prefresh/vite/runtime';
        ${'import'} { flushUpdates } from '@prefresh/vite/utils';

        let prevRefreshReg;
        let prevRefreshSig;

        if (import.meta.hot) {
          prevRefreshReg = self.$RefreshReg$ || (() => {});
          prevRefreshSig = self.$RefreshSig$ || (() => (type) => type);

          self.$RefreshReg$ = (type, id) => {
            self.__PREFRESH__.register(type, ${JSON.stringify(id)} + " " + id);
          }

          self.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
              return type;
            };
          };
        }
        `;

      if (hasSig && !hasReg) {
        return {
          code: `
            ${prelude}
            ${result.code}
          `,
          map: result.map,
        };
      }

      return {
        code: `
        ${prelude}

        ${result.code}

        if (import.meta.hot) {
          self.$RefreshReg$ = prevRefreshReg;
          self.$RefreshSig$ = prevRefreshSig;
          import.meta.hot.accept((m) => {
            try {
              flushUpdates();
            } catch (e) {
              self.location.reload();
            }
          });
        }
      `,
        map: result.map,
      };
    },
  };
}

const transform = (code, path) =>
  transformSync(code, {
    plugins: [[require('@prefresh/babel-plugin'), { skipEnvCheck: true }]],
    ast: false,
    sourceMaps: true,
    sourceFileName: path,
    configFile: false,
    babelrc: false,
  });
