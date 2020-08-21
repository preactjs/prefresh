const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const puppeteer = require('puppeteer');

const timeout = n => new Promise(r => setTimeout(r, n));

const fixtureDir = path.join(__dirname, '../test/fixture');
const tempDir = path.join(__dirname, '../temp');
let devServer;
let browser;
let page;

const getEl = async selectorOrEl => {
	return typeof selectorOrEl === 'string'
		? await page.$(selectorOrEl)
		: selectorOrEl;
};

const getText = async selectorOrEl => {
	const el = await getEl(selectorOrEl);
	return el ? el.evaluate(el => el.textContent) : null;
};

async function updateFile(file, replacer) {
	const compPath = path.join(tempDir, file);
	const content = await fs.readFile(compPath, 'utf-8');
	await fs.writeFile(compPath, replacer(content));
}

async function expectByPolling(poll, expected) {
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
}

beforeAll(async () => {
	try {
		await fs.remove(tempDir);
	} catch (e) {}

	await fs.copy(fixtureDir, tempDir, {
		filter: file => !/dist|node_modules/.test(file)
	});
	await execa('yarn', { cwd: tempDir });
	await execa('yarn', { cwd: path.join(tempDir, 'optimize-linked') });
});

afterAll(async () => {
	try {
		await fs.remove(tempDir);
	} catch (e) {}
	if (browser) await browser.close();
	if (devServer) {
		devServer.kill('SIGTERM', {
			forceKillAfterTimeout: 2000
		});
	}
});

describe('vite', () => {
	beforeAll(async () => {
		browser = await puppeteer.launch(
			process.env.CI
				? { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
				: {}
		);
		page = await browser.newPage();
	});

	test('hmr', async () => {
		const button = await page.$('.button');
		expect(await getText(button)).toMatch('Increment');

		await updateFile('src/app.jsx', content =>
			content.replace('Increment', 'Decrement')
		);

		await expectByPolling(() => getText(button), 'Decrement');
	});
});
