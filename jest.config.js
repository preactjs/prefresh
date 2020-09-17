module.exports = {
	testPathIgnorePatterns: ['/node_modules/', '/packages/'],
	watchPathIgnorePatterns: ['<rootDir>/temp'],
	moduleNameMapper: {
		'@prefresh/babel': '<rootDir>/packages/babel',
		'@prefresh/core': '<rootDir>/packages/core',
		'@prefresh/utils': '<rootDir>/packages/utils'
	}
};
