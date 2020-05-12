const { Template } = require('webpack');

const RefreshModuleRuntime = Template.getFunctionContent(require('./runtime'))
	.trim()
	.replace(/^ {2}/gm, '');

function RefreshHotLoader(source, inputSourceMap) {
	// Use callback to allow source maps to pass through
	this.callback(null, source + '\n\n' + RefreshModuleRuntime, inputSourceMap);
}

module.exports = RefreshHotLoader;
