/* globals __prefresh_utils__ */
module.exports = function() {
	const isPrefreshComponent = __prefresh_utils__.registerExports(module);

	if (module.hot && isPrefreshComponent) {
		const hotModuleExports = __prefresh_utils__.getExports(module);
		const previousHotModuleExports =
			module.hot.data && module.hot.data.moduleExports;

		if (previousHotModuleExports) {
			try {
				for (let i in hotModuleExports) {
					if (typeof hotModuleExports[i] === 'function') {
						if (i in previousHotModuleExports) {
							__prefresh_utils__.compareSignatures(
								previousHotModuleExports[i],
								hotModuleExports[i]
							);
						}
					}
				}
				__prefresh_utils__.flush();
			} catch (e) {
				// Only available in newer webpack versions.
				if (module.hot.invalidate) {
					module.hot.invalidate();
				} else {
					self.location.reload();
				}
			}
		}

		module.hot.dispose(function(data) {
			data.moduleExports = __prefresh_utils__.getExports(module);
		});

		module.hot.accept(function errorRecovery() {
			require.cache[module.id].hot.accept(errorRecovery);
		});
	}
};
