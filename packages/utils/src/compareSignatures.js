exports.compareSignatures = (prev, next, name) => {
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
			window.location.reload();
			// self.__PREFRESH__.replaceHook(prev, next, true);
		} else {
			self.__PREFRESH__.replaceComponent(prev, next, true);
		}
		//} else if (isHook) {
		//	self.__PREFRESH__.replaceHook(prev, next, false);
	} else {
		self.__PREFRESH__.replaceComponent(prev, next, false);
	}
};
