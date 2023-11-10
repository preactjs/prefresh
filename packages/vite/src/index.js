const { transformSync } = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const prefreshBabelPlugin = require('@prefresh/babel-plugin');

/** @returns {import('vite').Plugin} */
module.exports = function prefreshPlugin(options = {}) {
  let shouldSkip = false;
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'prefresh',
    configResolved(config) {
      shouldSkip = config.command === 'build' || config.isProduction;
    },
    async transform(code, id, options) {
      const ssr =
        typeof options === 'boolean'
          ? options
          : options && options.ssr === true;
      if (
        shouldSkip ||
        !/\.(t|j)sx?$/.test(id) ||
        id.includes('node_modules') ||
        id.includes('?worker') ||
        !filter(id) ||
        ssr
      )
        return;

      const parserPlugins = [
        'jsx',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        /\.tsx?$/.test(id) && 'typescript',
        ...((options && options.parserPlugins) || []),
      ].filter(Boolean);

      const result = transform(code, id, parserPlugins);
      const hasReg = /\$RefreshReg\$\(/.test(result.code);
      const hasSig = /\$RefreshSig\$\(/.test(result.code);

      if (!hasSig && !hasReg) return code;

      const prefreshCore = await this.resolve('@prefresh/core', __filename);
      const prefreshUtils = await this.resolve('@prefresh/utils', __filename);

      const prelude = `
        ${'import'} ${JSON.stringify(prefreshCore.id)};
        ${'import'} { flush as flushUpdates } from ${JSON.stringify(
        prefreshUtils.id
      )};

        let prevRefreshReg;
        let prevRefreshSig;

        if (import.meta.hot) {
          prevRefreshReg = self.$RefreshReg$ || (() => {});
          prevRefreshSig = self.$RefreshSig$ || (() => (type) => type);

          self.$RefreshReg$ = (type, id) => {
            self.__PREFRESH__.register(type, ${JSON.stringify(id)} + " " + id);
          };

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
        `.replace(/[\n]+/gm, '');

      if (hasSig && !hasReg) {
        return {
          code: `${prelude}${result.code}`,
          map: result.map,
        };
      }

      return {
        code: `${prelude}${result.code}

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
};

const transform = (code, path, plugins) =>
  transformSync(code, {
    plugins: [[prefreshBabelPlugin, { skipEnvCheck: true }]],
    parserOpts: {
      plugins,
    },
    ast: false,
    sourceMaps: true,
    filename: path,
    sourceFileName: path,
    configFile: false,
    babelrc: false,
  });
