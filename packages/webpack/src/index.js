const webpack = require('webpack');
const path = require('path');
const { createRefreshTemplate } = require('./utils/createTemplate');
const { injectEntry } = require('./utils/injectEntry');
const {
  prefreshUtils,
  NAME,
  matcherOptions,
  nextMatcherOptions,
  injectRefreshFunctions,
} = require('./utils/constants');

class ReloadPlugin {
  constructor(options) {
    this.matcher = webpack.ModuleFilenameHelpers.matchObject.bind(
      undefined,
      options && options.runsInNextJs ? nextMatcherOptions : matcherOptions
    );

    this.options = {
      overlay: options && options.overlay,
      runsInNextJs: Boolean(options && options.runsInNextJs),
      entryOptions: options && options.entryOptions,
    };
  }

  webpack4(compiler) {
    compiler.hooks.normalModuleFactory.tap(NAME, nmf => {
      nmf.hooks.afterResolve.tap(NAME, data => {
        if (
          this.matcher(data.resource) &&
          !data.resource.includes('@prefresh') &&
          !data.resource.includes(path.join(__dirname, './loader')) &&
          !data.resource.includes(path.join(__dirname, './utils'))
        ) {
          data.loaders.unshift({
            loader: require.resolve('./loader'),
            options: undefined,
          });
        }

        return data;
      });
    });

    compiler.hooks.compilation.tap(NAME, compilation => {
      injectRefreshFunctions(compilation);
      compilation.mainTemplate.hooks.require.tap(NAME, (source, chunk, hash) =>
        createRefreshTemplate(
          source,
          chunk,
          hash,
          compilation.mainTemplate,
          this.options
        )
      );
    });
  }

  webpack5(compiler, RuntimeGlobals) {
    const createPrefreshRuntimeModule = require('./utils/Runtime');
    const PrefreshRuntimeModule = createPrefreshRuntimeModule(
      compiler.webpack ? compiler.webpack : webpack
    );

    compiler.hooks.compilation.tap(
      NAME,
      (compilation, { normalModuleFactory }) => {
        if (compilation.compiler !== compiler) {
          return;
        }

        injectRefreshFunctions(compilation);

        compilation.hooks.additionalTreeRuntimeRequirements.tap(
          NAME,
          (chunk, runtimeRequirements) => {
            runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
            compilation.addRuntimeModule(chunk, new PrefreshRuntimeModule());
          }
        );

        normalModuleFactory.hooks.afterResolve.tap(
          NAME,
          ({ createData: data }) => {
            if (
              this.matcher(data.resource) &&
              !data.resource.includes('@prefresh') &&
              !data.resource.includes(path.join(__dirname, './loader')) &&
              !data.resource.includes(path.join(__dirname, './utils'))
            ) {
              data.loaders.unshift({
                loader: require.resolve('./loader'),
                options: undefined,
              });
            }
          }
        );
      }
    );
  }

  apply(compiler) {
    if (
      process.env.NODE_ENV === 'production' ||
      compiler.options.mode === 'production'
    )
      return;

    const internalWebpackVersion = Number(
      compiler.webpack ? compiler.webpack.version[0] : 4
    );
    const externalWebpackVersion = Number(webpack.version[0]);

    if (!externalWebpackVersion) {
      throw new Error(
        `Missing webpack Dependency, try installing webpack@${
          compiler.webpack ? compiler.webpack.version : 4
        } locally.`
      );
    }

    if (internalWebpackVersion !== externalWebpackVersion) {
      throw new Error(`
        You are using webpack v${internalWebpackVersion} and yet you have v${externalWebpackVersion} installed, which Prefresh is pulling.

        You may want to uninstall v${externalWebpackVersion} if possible, set overrides so that you only have v${internalWebpackVersion} available, or fix your lockfile to correct this.
      `);
    }

    let provide = {
      [prefreshUtils]: require.resolve('./utils/prefresh'),
    };

    if (this.options.overlay) {
      provide.__prefresh_errors__ = require.resolve(
        this.options.overlay.module
      );
    }

    const providePlugin = new webpack.ProvidePlugin(provide);
    providePlugin.apply(compiler);

    switch (Number(webpack.version[0])) {
      case 4: {
        compiler.options.entry = injectEntry(compiler.options.entry);
        this.webpack4(compiler);
        break;
      }
      case 5: {
        const dependency = webpack.EntryPlugin.createDependency(
          '@prefresh/core',
          { name: '@prefresh/core' }
        );
        compiler.hooks.make.tapAsync(NAME, (compilation, callback) => {
          compilation.addEntry(
            compiler.context,
            dependency,
            this.options.entryOptions,
            callback
          );
        });

        this.webpack5(
          compiler,
          compiler.webpack
            ? compiler.webpack.RuntimeGlobals
            : webpack.RuntimeGlobals
        );
        break;
      }
      default: {
        throw new Error('Unsupported webpack version.');
      }
    }
  }
}

ReloadPlugin.supportsNextJs = true;

module.exports = ReloadPlugin;
