const fs = require('fs-extra');
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
const waitForHmr = page => {
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

// chokidar (Vite's watcher) drops a `change` event for a path if another one
// was emitted for that same path less than 50ms earlier. Once the previous
// HMR update for a file has been applied its change event has already fired,
// so waiting this long after that point guarantees the next write is seen.
const SAME_FILE_GAP = 100;
const lastUpdated = new Map();

/**
 * Rewrites `filePath` with `replacer` and resolves once the resulting HMR
 * update has been applied in `page`.
 */
exports.updateFileAndWaitForHmr = async (page, filePath, replacer) => {
	const wait = (lastUpdated.get(filePath) || 0) + SAME_FILE_GAP - Date.now();
	if (wait > 0) await timeout(wait);

	const hmr = waitForHmr(page);
	const content = await fs.readFile(filePath, 'utf-8');
	await fs.writeFile(filePath, replacer(content));
	await hmr;
	lastUpdated.set(filePath, Date.now());
};

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
