const { Template } = require('webpack');
const { NAMESPACE } = require('./constants');

const afterModule = `
const exports = module.exports || module.__proto__.exports;
let shouldBind = false;

if (!exports || typeof exports != 'object') {
  shouldBind = false;
} else {
  for (const key in exports) {
    if (key === '__esmodule') continue;
    const exportValue = exports[key];
    if (typeof exportValue == 'function') {
      const name = exportValue.name || exportValue.displayName;
      if (name) {
        shouldBind = shouldBind || (typeof name === 'string' && name[0] == name[0].toUpperCase());
      }
    }
  }
}

if (module.hot && shouldBind) {
  const m = module.hot.data && module.hot.data.module && module.hot.data.module;
  if (m) {
    for (let i in module.exports) {
      const fn = module.exports[i];
      try {
        if (typeof fn === 'function') {
          if (i in m.exports) {
            self.${NAMESPACE}.replaceComponent(m.exports[i], fn);
          }
        }
      } catch (e) {
        self.location.reload();
      }
    }
  }

  module.hot.dispose(function(data) {
    data.module = module;
  });

  module.hot.accept(function errorRecovery() {
    require.cache[module.id].hot.accept(errorRecovery);
  });
}
`;

function createRefreshTemplate(source, chunk, hash, mainTemplate) {
	let filename = mainTemplate.outputOptions.filename;
	if (typeof filename === 'function') {
		filename = filename({
			chunk,
			hash,
			contentHashType: 'javascript',
			hashWithLength: length =>
				mainTemplate.renderCurrentHashCode(hash, length),
			noChunkHash: mainTemplate.useChunkHash(chunk)
		});
	}

	if (!filename || !filename.includes('.js')) {
		return source;
	}

	const lines = source.split('\n');

	// Webpack generates this line whenever the mainTemplate is called
	const moduleInitializationLineNumber = lines.findIndex(line =>
		line.startsWith('modules[moduleId].call')
	);

	return Template.asString([
		...lines.slice(0, moduleInitializationLineNumber),
		Template.indent(lines[moduleInitializationLineNumber]),
		afterModule,
		...lines.slice(moduleInitializationLineNumber + 1, lines.length)
	]);
}

exports.createRefreshTemplate = createRefreshTemplate;
