const { Template } = require('webpack');

const NAMESPACE = '__PREFRESH__';

const beforeModule = `
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;

window.$RefreshSig$ = () => {
  let status = 'begin';
  let savedType;
  let hasHooks;
  return (type, key, forceReset, getCustomHooks) => {
    if (!savedType) savedType = type;
    if (hasHooks === undefined) hasHooks = typeof getCustomHooks === 'function';
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
  };
};

window.$RefreshReg$ = () => {};

try {
`;

const afterModule = `
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}

const exports = module.exports || module.__proto__.exports;
let shouldBind = false;
let isCustomHook = false;
if (!exports || typeof exports != 'object') {
  shouldBind = false;
} else {
  for (const key in exports) {
    if (key === '__esmodule') continue;
    const exportValue = exports[key];
    if (typeof exportValue == 'function') {
      const name = exportValue.name || exportValue.displayName;
      if (name) {
        const isComponent = typeof name === 'string' && name[0] == name[0].toUpperCase();
        const isCustomHOook = typeof name === 'string' && name.startsWith('use') && name[3] == name[3].toUpperCase();
        shouldBind = shouldBind || isComponent || isCustomHook;
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
            const prevSignature = self.${NAMESPACE}.getSignature(fn) || {};
            const nextSignature = self.${NAMESPACE}.getSignature(m.exports[i]) || {};

            if (
              prevSignature.key !== nextSignature.key ||
              nextSignature.forceReset
            ) {
              window.location.reload();
            }

            self.${NAMESPACE}.replaceComponent(m.exports[i], fn);
          }
        }
      } catch (e) {
        console.log(e);
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
		beforeModule,
		Template.indent(lines[moduleInitializationLineNumber]),
		afterModule,
		...lines.slice(moduleInitializationLineNumber + 1, lines.length)
	]);
}

exports.createRefreshTemplate = createRefreshTemplate;
