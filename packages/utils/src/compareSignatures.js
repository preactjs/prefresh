exports.compareSignatures = (prev, next, name) => {
	const prevSignature = self.__PREFRESH__.getSignature(prev) || {};
	const nextSignature = self.__PREFRESH__.getSignature(next) || {};

	if (prevSignature.key !== nextSignature.key || nextSignature.forceReset) {
		if (
			typeof name === 'string' &&
			name.startsWith('use') &&
			name[3] == name[3].toUpperCase()
		) {
			window.location.reload();
		} else {
			self.__PREFRESH__.replaceComponent(next, prev, true);
		}
	} else {
		self.__PREFRESH__.replaceComponent(next, prev, false);
	}
};
