const { Template } = require('webpack');

const NAMESPACE = '__PREFRESH__';

const beforeModule = `
var prevRefreshReg = self.$RefreshReg$;
var prevRefreshSig = self.$RefreshSig$;

self.$RefreshSig$ = function() {
  var status = 'begin';
  var savedType;
  return function(type, key, forceReset, getCustomHooks) {
    if (!savedType) savedType = type;
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
    return type;
  };
};

self.$RefreshReg$ = function(type, id) {
  self.${NAMESPACE}.register(type, module.id + ' ' + id);
};

try {
`;

const afterModule = `
} finally {
  self.$RefreshReg$ = prevRefreshReg;
  self.$RefreshSig$ = prevRefreshSig;
}
`;

function createRefreshTemplate(source, chunk, hash, mainTemplate, options) {
  let filename = mainTemplate.outputOptions.filename;
  if (typeof filename === 'function') {
    filename = filename({
      chunk,
      hash,
      contentHashType: 'javascript',
      hashWithLength: length =>
        mainTemplate.renderCurrentHashCode(hash, length),
      noChunkHash: mainTemplate.useChunkHash(chunk),
    });
  }

  if (!filename || !filename.includes('.js')) {
    return source;
  }

  const lines = source.split('\n');

  // Webpack generates this line whenever the mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex(line =>
    options.runsInNextJs
      ? line.includes('modules[moduleId].call(')
      : line.startsWith('modules[moduleId].call')
  );

  if (moduleInitializationLineNumber === -1) {
    return source;
  }

  return Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    beforeModule,
    Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

exports.createRefreshTemplate = createRefreshTemplate;
