/* globals __prefresh_utils__ */
module.exports = function() {
	const isCitizen = __prefresh_utils__.registerExports(module);

	if (module.hot && isCitizen) {
		const moduleExports = __prefresh_utils__.getExports(module);
		const m =
			module.hot.data && module.hot.data.module && module.hot.data.module;

		if (m) {
			for (let i in moduleExports) {
				const fn = moduleExports[i];
				try {
					if (typeof fn === 'function') {
						const oldExports = __prefresh_utils__.getExports(m);
						if (i in oldExports) {
							__prefresh_utils__.compareSignatures(oldExports[i], fn);
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
