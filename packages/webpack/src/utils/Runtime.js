const NAMESPACE = '__PREFRESH__';

const beforeModule = `
self.$RefreshSig$ = function() {
  var status = 'begin';
  var savedType;

  return function(type, key, forceReset, getCustomHooks) {
    if (!savedType) savedType = type;
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
    return type;
  }
}
`;

const createPrefreshRuntimeModule = webpack =>
  class PrefreshRuntimeModule extends webpack.RuntimeModule {
    constructor() {
      super('prefresh', 5);
    }

    generate() {
      const { runtimeTemplate } = this.compilation;
      const declare = runtimeTemplate.supportsConst() ? 'const' : 'var';

      return webpack.Template.asString([
        `${
          webpack.RuntimeGlobals.interceptModuleExecution
        }.push(${runtimeTemplate.basicFunction('options', [
          `${declare} originalFactory = options.factory;`,
          `options.factory = ${runtimeTemplate.basicFunction(
            'moduleObject, moduleExports, webpackRequire',
            [
              `${declare} prevRefreshReg = self.$RefreshReg$;`,
              `${declare} prevRefreshSig = self.$RefreshSig$;`,
              beforeModule,
              `${declare} reg = ${runtimeTemplate.basicFunction(
                'currentModuleId',
                [
                  'self.$RefreshReg$ = function(type, id) {',
                  `self.${NAMESPACE}.register(type, currentModuleId + ' ' + id);`,
                  '};',
                ]
              )}`,
              'reg()',
              'try {',
              webpack.Template.indent(
                'originalFactory.call(this, moduleObject, moduleExports, webpackRequire);'
              ),
              '} finally {',
              webpack.Template.indent('self.$RefreshReg$ = prevRefreshReg;'),
              webpack.Template.indent('self.$RefreshSig$ = prevRefreshSig;'),
              '}',
            ]
          )}`,
        ])})`,
        '',
      ]);
    }
  };

module.exports = createPrefreshRuntimeModule;
