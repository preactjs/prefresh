const { transformSync } = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const prefreshBabelPlugin = require('@prefresh/babel-plugin');

const SCRIPT_LANG_RE = /\.(c|m)?(t|j)sx?$/;
let prefreshRolldownPromise;

function loadPrefreshRolldown() {
  prefreshRolldownPromise ||= import('@prefresh/rolldown').then(
    ({ default: prefreshRolldown }) => prefreshRolldown
  );
  return prefreshRolldownPromise;
}

function hasRolldownSupport(pluginContext) {
  return !!(
    pluginContext &&
    typeof pluginContext === 'object' &&
    pluginContext.meta &&
    typeof pluginContext.meta === 'object' &&
    'rolldownVersion' in pluginContext.meta
  );
}

function hasOxcSupport(config) {
  return !!(config.oxc && typeof config.oxc === 'object');
}

/** @returns {Promise<import('vite').PluginOption>} */
module.exports = async function prefreshPlugin(options = {}) {
  const prefreshRolldown = await loadPrefreshRolldown();
  const forceBabel = Object.prototype.hasOwnProperty.call(
    options,
    'parserPlugins'
  );

  return [
    preactOptionsPlugin(forceBabel),
    prefreshBabelTransformPlugin(options, forceBabel),
    prefreshRolldown(),
    prefreshWrapperPlugin(options),
  ];
};

/** @returns {import('vite').Plugin} */
function preactOptionsPlugin(forceBabel) {
  return {
    name: 'prefresh-preact-options',
    config(config, { command }) {
      const oxc = config.oxc || {};
      const jsx = oxc.jsx || {};
      const supportsRolldown = hasRolldownSupport(this);

      return supportsRolldown
        ? {
            oxc: {
              ...oxc,
              jsx: {
                ...jsx,
                importSource: oxc.jsx.importSource || 'preact',
                refresh: !forceBabel && command === 'serve',
              },
              jsxRefreshInclude: oxc.jsxRefreshInclude || /\.[jt]sx$/,
            },
          }
        : {};
    },
  };
}

/** @returns {import('vite').Plugin} */
function prefreshBabelTransformPlugin(options = {}, forceBabel) {
  let shouldSkip = false;
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'prefresh-babel-transform',
    apply: 'serve',
    configResolved(config) {
      shouldSkip =
        config.server.hmr === false || (!forceBabel && hasOxcSupport(config));
    },
    transform(code, id, transformOptions) {
      const ssr =
        typeof transformOptions === 'boolean'
          ? transformOptions
          : transformOptions && transformOptions.ssr === true;
      if (
        shouldSkip ||
        !SCRIPT_LANG_RE.test(id) ||
        id.includes('node_modules') ||
        id.includes('?worker') ||
        !filter(id) ||
        ssr
      ) {
        return;
      }

      const parserPlugins = [
        'jsx',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        /\.(c|m)?tsx?$/.test(id) && 'typescript',
        ...((options && options.parserPlugins) || []),
      ].filter(Boolean);

      return transform(code, id, parserPlugins);
    },
  };
}

/** @returns {import('vite').Plugin} */
function prefreshWrapperPlugin(options = {}) {
  let shouldSkip = false;
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'prefresh-wrapper',
    apply: 'serve',
    config(config) {
      const include = config.optimizeDeps?.include || [];

      return {
        optimizeDeps: {
          include: [
            ...new Set([...include, '@prefresh/core', '@prefresh/utils']),
          ],
        },
      };
    },
    configResolved(config) {
      shouldSkip = config.server.hmr === false;
    },
    async transform(code, id, options) {
      const ssr =
        typeof options === 'boolean'
          ? options
          : options && options.ssr === true;
      if (
        shouldSkip ||
        !SCRIPT_LANG_RE.test(id) ||
        id.includes('node_modules') ||
        id.includes('?worker') ||
        !filter(id) ||
        ssr
      ) {
        return;
      }

      const hasReg = /\$RefreshReg\$\(/.test(code);
      const hasSig = /\$RefreshSig\$\(/.test(code);

      if (!hasSig && !hasReg) return;

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
          code: `${prelude}${code}`,
          map: null,
        };
      }

      return {
        code: `${prelude}${code}

        if (import.meta.hot) {
          self.$RefreshReg$ = prevRefreshReg;
          self.$RefreshSig$ = prevRefreshSig;
          import.meta.hot.accept((m) => {
            try {
              flushUpdates();
            } catch (e) {
              console.log('[PREFRESH] Failed to flush updates:', e);
              self.location.reload();
            }
          });
        }
      `,
        map: null,
      };
    },
  };
}

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
