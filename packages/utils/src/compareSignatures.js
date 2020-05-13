exports.compareSignatures = (prev, next) => {
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
};
