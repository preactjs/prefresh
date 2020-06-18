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
    return type;
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
