const { isComponent, compareSignatures } = require('@prefresh/utils');

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

module.exports = Object.freeze({
	compareSignatures,
	getExports,
	isComponent
});
