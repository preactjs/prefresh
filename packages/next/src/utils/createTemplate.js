const { Template } = require('webpack');

const NAMESPACE = '__PREFRESH__';

const beforeModule = `
const prevRefreshReg = self.$RefreshReg$;
const prevRefreshSig = self.$RefreshSig$;

self.$RefreshSig$ = () => {
  let status = 'begin';
  let savedType;
  return (type, key, forceReset, getCustomHooks) => {
    if (!savedType) savedType = type;
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
  };
};

self.$RefreshReg$ = (type, id) => {
  self.${NAMESPACE}.register(type, module.i + ' ' + id);
};

try {
`;

const afterModule = `
} finally {
  self.$RefreshReg$ = prevRefreshReg;
  self.$RefreshSig$ = prevRefreshSig;
}
`;

function createRefreshTemplate(source, chunk, hash, mainTemplate) {
	const lines = source.split('\n');
	const moduleInitializationLineNumber = lines.findIndex(l =>
		l.includes('modules[moduleId].call(')
	);

	if (moduleInitializationLineNumber === -1) return source;

	return Template.asString([
		...lines.slice(0, moduleInitializationLineNumber),
		beforeModule,
		Template.indent(lines[moduleInitializationLineNumber]),
		afterModule,
		...lines.slice(moduleInitializationLineNumber + 1, lines.length)
	]);
}

exports.createRefreshTemplate = createRefreshTemplate;
