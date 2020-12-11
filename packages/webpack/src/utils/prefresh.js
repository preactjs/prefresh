const { isComponent, flush } = require('@prefresh/utils');

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

const shouldBind = m => {
	let isCitizen = false;
	const moduleExports = getExports(m);

	if (
		typeof moduleExports === 'function' &&
		isComponent(moduleExports.name || moduleExports.displayName)
	) {
		isCitizen = true;
	}

	if (
		moduleExports === undefined ||
		moduleExports === null ||
		typeof moduleExports !== 'object'
	) {
		isCitizen = isCitizen || false;
	} else {
		for (const key in moduleExports) {
			if (key === '__esModule') continue;

			const exportValue = moduleExports[key];
			if (
				typeof exportValue === 'function' &&
				isComponent(exportValue.name || exportValue.displayName)
			) {
				isCitizen = isCitizen || true;
			}
		}
	}

	return isCitizen;
};

module.exports = Object.freeze({
	getExports,
	shouldBind,
	flush
});
