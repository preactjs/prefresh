function injectRefreshFunctions(compilation, Template) {
  const hookVars = compilation.mainTemplate.hooks.localVars;

  hookVars.tap('PrefreshNextWebpackPlugin', source =>
    Template.asString([
      source,
      '',
      '// noop fns to prevent runtime errors during initialization',
      'if (typeof self !== "undefined") {',
      Template.indent('self.$RefreshReg$ = function () {};'),
      Template.indent('self.$RefreshSig$ = function () {'),
      Template.indent(Template.indent('return function (type) {')),
      Template.indent(Template.indent(Template.indent('return type;'))),
      Template.indent(Template.indent('};')),
      Template.indent('};'),
      '}',
    ])
  );
}

function webpack4(this, compiler) {
  const { Template } = this;

  compiler.hooks.compilation.tap('PrefreshNextWebpackPlugin', compilation => {
    injectRefreshFunctions(compilation, Template);

    const hookRequire = compilation.mainTemplate.hooks.require;

    hookRequire.tap('PrefreshNextWebpackPlugin', source => {
      const lines = source.split('\n');
      const evalIndex = lines.findIndex(l =>
        l.includes('modules[moduleId].call(')
      );

      if (evalIndex === -1) return source;

      return Template.asString([
        ...lines.slice(0, evalIndex),
        `
        var hasRefresh = typeof self !== "undefined" && !!self.$intercept$;
        var cleanup = hasRefresh
          ? self.$intercept$(moduleId)
          : function() {};
        try {
        `,
        lines[evalIndex],
        `
        } finally {
          cleanup();
        }
        `,
        ...lines.slice(evalIndex + 1),
      ]);
    });
  });
}

function webpack5(this, compiler) {
  const { RuntimeGlobals, RuntimeModule, Template } = this;
  class ReactRefreshRuntimeModule extends RuntimeModule {
    constructor() {
      super('prefresh', 5);
    }

    generate() {
      const { runtimeTemplate } = this.compilation;
      return Template.asString([
        `if (${RuntimeGlobals.interceptModuleExecution}) {`,
        `${
          RuntimeGlobals.interceptModuleExecution
        }.push(${runtimeTemplate.basicFunction('options', [
          `${
            runtimeTemplate.supportsConst() ? 'const' : 'var'
          } originalFactory = options.factory;`,
          `options.factory = ${runtimeTemplate.basicFunction(
            'moduleObject, moduleExports, webpackRequire',
            [
              `${
                runtimeTemplate.supportsConst() ? 'const' : 'var'
              } hasRefresh = typeof self !== "undefined" && !!self.$intercept$;`,
              `${
                runtimeTemplate.supportsConst() ? 'const' : 'var'
              } cleanup = hasRefresh ? self.$intercept$(moduleObject.id) : ${
                runtimeTemplate.supportsArrowFunction()
                  ? '() => {}'
                  : 'function() {}'
              };`,
              'try {',
              Template.indent(
                'originalFactory.call(this, moduleObject, moduleExports, webpackRequire);'
              ),
              '} finally {',
              Template.indent(`cleanup();`),
              '}',
            ]
          )}`,
        ])})`,
        '}',
      ]);
    }
  }

  compiler.hooks.compilation.tap('PrefreshNextWebpackPlugin', compilation => {
    injectRefreshFunctions(compilation, Template);

    compilation.hooks.additionalTreeRuntimeRequirements.tap(
      'PrefreshNextWebpackPlugin',
      chunk => {
        compilation.addRuntimeModule(chunk, new ReactRefreshRuntimeModule());
      }
    );
  });
}

class PrefreshNextWebpackPlugin {
  constructor(
    { version, RuntimeGlobals, RuntimeModule, Template } = require('webpack')
  ) {
    this.webpackMajorVersion = parseInt(version ?? '', 10);
    this.RuntimeGlobals = RuntimeGlobals;
    this.RuntimeModule = RuntimeModule;
    this.Template = Template;
  }

  apply(compiler) {
    switch (this.webpackMajorVersion) {
      case 4: {
        webpack4.call(this, compiler);
        break;
      }
      case 5: {
        webpack5.call(this, compiler);
        break;
      }
      default: {
        throw new Error(
          `Unsupported webpack version ${this.webpackMajorVersion}.`
        );
      }
    }
  }
}

export default PrefreshNextWebpackPlugin;
