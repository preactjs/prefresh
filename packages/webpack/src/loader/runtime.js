module.exports = function() {
	const isPreactCitizen = name =>
		typeof name === 'string' &&
		name[0] &&
		(name[0] == name[0].toUpperCase() ||
			(name.startsWith('use') && name[3] == name[3].toUpperCase()));

	// eslint-disable-next-line
	let moduleExports = module.exports || module.__proto__.exports;
	const moduleId = module.id;

	let isCitizen = false;

	if (
		typeof moduleExports === 'function' &&
		isPreactCitizen(moduleExports.name)
	) {
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
			if (
				typeof exportValue === 'function' &&
				isPreactCitizen(exportValue.name)
			) {
				isCitizen = isCitizen || true;
				const typeID = moduleId + ' %exports% ' + key;
				window.__PREFRESH__.register(exportValue, typeID);
			}
		}
	}

	if (module.hot && isCitizen) {
		// eslint-disable-next-line
		moduleExports = module.exports || module.__proto__.exports;
		const m =
			module.hot.data && module.hot.data.module && module.hot.data.module;
		if (m) {
			for (let i in moduleExports) {
				const fn = moduleExports[i];
				try {
					if (typeof fn === 'function') {
						// eslint-disable-next-line
						const oldExports = m.exports || m.__proto__.exports;
						if (i in oldExports) {
							const prev = oldExports[i];
							const next = fn;

							const prevSignature = self.__PREFRESH__.getSignature(prev) || {};
							const nextSignature = self.__PREFRESH__.getSignature(next) || {};

							let finalName = name || nextSignature.type.name;
							const isHook =
								typeof finalName === 'string' &&
								finalName.startsWith('use') &&
								finalName[3] == finalName[3].toUpperCase();

							if (
								prevSignature.key !== nextSignature.key ||
								prevSignature.fullKey !== nextSignature.fullKey ||
								nextSignature.forceReset
							) {
								if (isHook) {
									self.__PREFRESH__.replaceHook(prev, next, true);
								} else {
									self.__PREFRESH__.replaceComponent(prev, next, true);
								}
							} else if (isHook) {
								self.__PREFRESH__.replaceHook(prev, next, false);
							} else {
								self.__PREFRESH__.replaceComponent(prev, next, false);
							}
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
};
