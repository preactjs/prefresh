const { Template } = require('webpack');

const afterModule = `
if (module.hot) {
  const m = module.hot.data && module.hot.data.module && module.hot.data.module;
  if (m) {
    for (let i in module.exports) {
      const fn = module.exports[i];
      if (typeof fn === 'function') {
        if (i in m.exports) {
          console.log('replacing', fn)
          __PREACT__.replaceComponent(m.exports[i], fn);
        }
      }
    }
  } else {
    // TODO: determine what condition we need here.
    // window.location.reload();
  }

  module.hot.dispose(function(data) {
    data.module = module;
  });

  module.hot.accept(function errorRecovery() {
    // require.cache[module.id].hot.accept(errorRecovery);
  });
}
`;

function createRefreshTemplate(source, renderContext) {
  const lines = source.split('\n');

  // Webpack generates this line whenever the mainTemplate is called
  const moduleInitializationLineNumber = lines.findIndex((line) =>
    line.startsWith('modules[moduleId].call')
  );

  return Template.asString([
    ...lines.slice(0, moduleInitializationLineNumber),
    Template.indent(lines[moduleInitializationLineNumber]),
    afterModule,
    ...lines.slice(moduleInitializationLineNumber + 1, lines.length),
  ]);
}

exports.createRefreshTemplate = createRefreshTemplate;
