const { createFilter } = require('@rollup/pluginutils');

const SCRIPT_LANG_RE = /\.(c|m)?(t|j)sx?$/;
let babel;
let prefreshRolldownPromise;
let viteSupportsHookFilters;
let viteVersionParts;

function loadBabel() {
  babel ||= {
    transformSync: require('@babel/core').transformSync,
    prefreshBabelPlugin: require('@prefresh/babel-plugin'),
  };
  return babel;
}

function loadPrefreshRolldown() {
  prefreshRolldownPromise ||= import('@prefresh/rolldown').then(
    ({ default: prefreshRolldown }) => prefreshRolldown
  );
  return prefreshRolldownPromise;
}

function supportsHookFilters() {
  if (viteSupportsHookFilters !== undefined) return viteSupportsHookFilters;

  const [major, minor] = getViteVersionParts();
  viteSupportsHookFilters = major > 6 || (major === 6 && minor >= 3);

  return viteSupportsHookFilters;
}

function getViteVersionParts() {
  if (viteVersionParts) return viteVersionParts;

  try {
    viteVersionParts = require('vite/package.json')
      .version.split('.')
      .map(Number);
  } catch (error) {
    viteVersionParts = [0, 0, 0];
  }

  return viteVersionParts;
}

function supportsRolldownVite() {
  const [major] = getViteVersionParts();
  return major >= 8;
}

function withScriptHookFilter(handler) {
  return supportsHookFilters()
    ? {
        filter: {
          id: SCRIPT_LANG_RE,
        },
        handler,
      }
    : handler;
}

function getEsbuildOptions(config) {
  return config.esbuild && typeof config.esbuild === 'object'
    ? config.esbuild
    : {};
}

function getOxcOptions(config) {
  return config.oxc && typeof config.oxc === 'object' ? config.oxc : {};
}

function stripHandledEsbuildOptions(config) {
  const esbuild = getEsbuildOptions(config);

  if (!Object.keys(esbuild).length) return config.esbuild;

  const { jsx, jsxFactory, jsxFragment, jsxImportSource, jsxInject, ...rest } =
    esbuild;

  return Object.keys(rest).length ? rest : false;
}

function resolveJsxRuntime(jsx, esbuild) {
  if (jsx.runtime) return jsx.runtime;
  if (esbuild.jsx === 'automatic') return 'automatic';
  if (esbuild.jsx === 'preserve') return 'preserve';
  return 'classic';
}

function resolvePrefreshJsxOptions(jsx, esbuild) {
  return {
    ...jsx,
    runtime: resolveJsxRuntime(jsx, esbuild),
    pragma: jsx.pragma || esbuild.jsxFactory || 'h',
    pragmaFrag: jsx.pragmaFrag || esbuild.jsxFragment || 'Fragment',
    importSource: jsx.importSource || esbuild.jsxImportSource || 'preact',
  };
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

/** @returns {Promise<import('vite').PluginOption>} */
module.exports = async function prefreshPlugin(options = {}) {
  const forceBabel = Object.prototype.hasOwnProperty.call(
    options,
    'parserPlugins'
  );
  const prefreshRolldown = supportsRolldownVite()
    ? await loadPrefreshRolldown()
    : null;

  return [
    preactOptionsPlugin(forceBabel),
    prefreshBabelTransformPlugin(options, forceBabel),
    ...(prefreshRolldown ? [prefreshRolldown()] : []),
    prefreshWrapperPlugin(options),
  ];
};

/** @returns {import('vite').Plugin} */
function preactOptionsPlugin(forceBabel) {
  return {
    name: 'prefresh-preact-options',
    config(config, { command }) {
      const oxc = getOxcOptions(config);
      const jsx = oxc.jsx || {};
      const esbuild = getEsbuildOptions(config);
      const prefreshJsx = resolvePrefreshJsxOptions(jsx, esbuild);
      const optimizeDeps = config.optimizeDeps || {};
      const rolldownOptions = optimizeDeps.rolldownOptions || {};
      const transformOptions = rolldownOptions.transform || {};
      const supportsRolldown = hasRolldownSupport(this);

      return supportsRolldown
        ? {
            esbuild: stripHandledEsbuildOptions(config),
            optimizeDeps: {
              ...optimizeDeps,
              rolldownOptions: {
                ...rolldownOptions,
                transform: {
                  ...transformOptions,
                  jsx: {
                    ...prefreshJsx,
                  },
                },
              },
            },
            oxc: {
              ...oxc,
              include: oxc.include || SCRIPT_LANG_RE,
              jsxInject: oxc.jsxInject || esbuild.jsxInject,
              jsx: {
                ...prefreshJsx,
                refresh: !forceBabel && command === 'serve',
              },
              jsxRefreshInclude: oxc.jsxRefreshInclude || SCRIPT_LANG_RE,
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
      shouldSkip = config.server.hmr === false;
    },
    transform: withScriptHookFilter(function (code, id, transformOptions) {
      const useOxcRefresh = !forceBabel && hasRolldownSupport(this);
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

      if (useOxcRefresh) {
        const hasReg = /\$RefreshReg\$\(/.test(code);
        const hasSig = /\$RefreshSig\$\(/.test(code);

        if (hasReg || hasSig) return;
      }

      const result = transform(code, id, parserPlugins);

      if (useOxcRefresh) {
        const hasReg = /\$RefreshReg\$\(/.test(result.code);
        const hasSig = /\$RefreshSig\$\(/.test(result.code);

        if (!hasReg && !hasSig) return;
      }

      return result;
    }),
  };
}

/** @returns {import('vite').Plugin} */
function prefreshWrapperPlugin(options = {}) {
  let shouldSkip = false;
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'prefresh-wrapper',
    apply: 'serve',
    config() {
      return {
        optimizeDeps: {
          include: ['@prefresh/core', '@prefresh/utils'],
        },
      };
    },
    configResolved(config) {
      shouldSkip = config.server.hmr === false;
    },
    transform: withScriptHookFilter(async function (code, id, options) {
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
            let savedType;
            let hasCustomHooks = false;
            let didCollectHooks = false;
            return (type, key, forceReset, getCustomHooks) => {
              if (typeof key === 'string') {
                // Keyed call: register this type. May be called multiple times
                // for HOC chains like _s(memo(_c = _s(inner, key)), key).
                if (!savedType) {
                  savedType = type;
                  hasCustomHooks = typeof getCustomHooks === 'function';
                }
                if (type != null) {
                  self.__PREFRESH__.sign(type, key, forceReset, getCustomHooks, 'begin');
                }
              } else {
                // Body call _s() — collect custom hooks once on first render.
                if (!didCollectHooks && hasCustomHooks) {
                  didCollectHooks = true;
                  self.__PREFRESH__.sign(savedType, undefined, undefined, undefined, 'needsHooks');
                }
              }
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
    }),
  };
}

const transform = (code, path, plugins) => {
  const { transformSync, prefreshBabelPlugin } = loadBabel();

  return transformSync(code, {
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
};
