const path = require('path');

const timeout = n => new Promise(r => setTimeout(r, n));

exports.timeout = timeout;

exports.getFixtureDir = integration =>
	path.join(__dirname, '../test/fixture', integration);

exports.getTempDir = integration =>
	path.join(__dirname, '../temp', integration);

const HMR_TIMEOUT = 10000;

/**
 * Resolves once the Vite client in `page` reports that it applied an HMR
 * update. Vite logs "[vite] hot updated: <path>" after the module's accept
 * callbacks (and therefore Prefresh's flush) have run, which makes this a
 * deterministic signal compared to sleeping for a fixed amount of time.
 *
 * Call this *before* writing the file so the message can't be missed.
 */
exports.waitForHmr = page => {
	let listener;
	let timer;
	return new Promise((resolve, reject) => {
		listener = msg => {
			if (msg.text().includes('hot updated')) resolve();
		};
		page.on('console', listener);
		timer = setTimeout(
			() =>
				reject(
					new Error(`No HMR update was applied within ${HMR_TIMEOUT}ms`)
				),
			HMR_TIMEOUT
		);
	})
		.then(() =>
			// Prefresh schedules the re-render in a microtask; give the page
			// a frame so it has committed before we interact with it.
			page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())))
		)
		.finally(() => {
			clearTimeout(timer);
			page.off('console', listener);
		});
};

exports.expectByPolling =async (poll, expected) => {
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
