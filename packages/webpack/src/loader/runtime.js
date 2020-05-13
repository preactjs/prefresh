module.exports = function() {
	// TODO: find a way to use @prefresh/utils here
	const isComponent = name =>
		typeof name === 'string' && name[0] && name[0] == name[0].toUpperCase();

	// TODO: find a way to abstrat this out to an external helper file.
	// eslint-disable-next-line
	const getExports = m => m.exports || m.__proto__.exports;

	let moduleExports = getExports(module);
	const moduleId = module.id;

	let isCitizen = false;

	// TODO: find a way to abstrat this out to an external helper file.
	if (typeof moduleExports === 'function' && isComponent(moduleExports.name)) {
		isCitizen = true;
		window.__PREFRESH__.register(moduleExports, moduleId + ' %exports%');
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
			if (typeof exportValue === 'function' && isComponent(exportValue.name)) {
				isCitizen = isCitizen || true;
				const typeID = moduleId + ' %exports% ' + key;
				window.__PREFRESH__.register(exportValue, typeID);
			}
		}
	}

	if (module.hot && isCitizen) {
		moduleExports = getExports(module);
		const m =
			module.hot.data && module.hot.data.module && module.hot.data.module;

		if (m) {
			for (let i in moduleExports) {
				const fn = moduleExports[i];
				try {
					if (typeof fn === 'function') {
						const oldExports = getExports(m);
						if (i in oldExports) {
							const prev = oldExports[i];
							const next = fn;

							// TODO: find a way to use @prefresh/utils here
							const prevSignature = self.__PREFRESH__.getSignature(prev) || {};
							const nextSignature = self.__PREFRESH__.getSignature(next) || {};

							if (
								prevSignature.key !== nextSignature.key ||
								self.__PREFRESH__.computeKey(prevSignature) !==
									self.__PREFRESH__.computeKey(nextSignature) ||
								nextSignature.forceReset
							) {
								self.__PREFRESH__.replaceComponent(prev, next, true);
							} else {
								self.__PREFRESH__.replaceComponent(prev, next, false);
							}
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
};
