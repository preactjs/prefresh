const { Template } = require('webpack');

exports.prefreshUtils = '__prefresh_utils__';
exports.NAME = 'PrefreshWebpackPlugin';

exports.matcherOptions = {
  include: /\.([jt]sx?)$/,
  exclude: /node_modules/,
};

exports.nextMatcherOptions = {
  include: /\.([jt]sx?)$/,
  exclude: /node_modules/,
};

exports.injectRefreshFunctions = function (compilation) {
  const hookVars = compilation.mainTemplate.hooks.localVars;

  hookVars.tap('ReactFreshWebpackPlugin', source =>
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
};
