const path = require('path');

const timeout = n => new Promise(r => setTimeout(r, n));

exports.getFixtureDir = integration =>
	path.join(__dirname, '../test/fixture', integration);

exports.getTempDir = integration =>
	path.join(__dirname, '../temp', integration);

exports.expectByPolling = async (poll, expected) => {
	const maxTries = 20;
	for (let tries = 0; tries < maxTries; tries++) {
		const actual = (await poll()) || '';
		if (actual.indexOf(expected) > -1 || tries === maxTries - 1) {
			expect(actual).toMatch(expected);
			break;
		} else {
			await timeout(50);
		}
	}
};
