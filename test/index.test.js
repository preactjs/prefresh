const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const puppeteer = require('puppeteer');
const { expectByPolling, getFixtureDir, getTempDir } = require('./utils');
const {
	bin,
	binArgs,
	goMessage,
	defaultPort,
	integrations
} = require('./constants');

integrations.forEach(integration => {
	async function updateFile(file, replacer) {
		const compPath = path.join(getTempDir(integration), file);
		const content = await fs.readFile(compPath, 'utf-8');
		await fs.writeFile(compPath, replacer(content));
	}

	describe(integration, () => {
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

		let serverLogs = [];
		let browserLogs = [];

		const browserConsoleListener = msg => {
			console.log('[BROWSER LOG]: ', msg);
			browserLogs.push(msg.text());
		};

		let serverConsoleListener;

		jest.setTimeout(100000);

		beforeAll(async () => {
			try {
				await fs.remove(getTempDir(integration));
			} catch (e) {}

			await fs.copy(getFixtureDir(integration), getTempDir(integration), {
				filter: file => !/dist|node_modules/.test(file)
			});

			await execa('yarn', { cwd: getTempDir(integration) });

			browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox']
			});
			page = await browser.newPage();

			devServer = execa(
				bin[integration](getTempDir(integration)),
				binArgs[integration],
				{
					cwd: getTempDir(integration)
				}
			);

			await new Promise(resolve => {
				devServer.stdout.on(
					'data',
					(serverConsoleListener = data => {
						console.log('[SERVER LOG]: ', data.toString());
						if (data.toString().match(goMessage[integration])) resolve();
					})
				);
			});

			page = await browser.newPage();
			page.on('console', browserConsoleListener);

			await page.goto('http://localhost:' + defaultPort[integration]);
		});

		afterAll(async () => {
			try {
				await fs.remove(getTempDir(integration));
			} catch (e) {}
			page.removeListener('console', browserConsoleListener);

			if (browser) await browser.close();
			if (devServer) {
				devServer.stdout.removeEventListener(serverConsoleListener);
				devServer.kill('SIGTERM', {
					forceKillAfterTimeout: 2000
				});
			}
		});

		test('basic component', async () => {
			const button = await page.$('.button');
			await expectByPolling(() => getText(button), 'Increment');

			await updateFile('src/app.jsx', content =>
				content.replace('Increment', 'Increment (+)')
			);

			await expectByPolling(() => getText(button), 'Increment (+)');
		});

		test('custom hook', async () => {
			const value = await page.$('.value');
			const button = await page.$('.button');
			expect(await getText(value)).toMatch('Count: 0');
			await expectByPolling(() => getText(value), 'Count: 0');

			await button.click();

			await expectByPolling(() => getText(value), 'Count: 1');

			await updateFile('src/useCounter.js', content =>
				content.replace('state + 1', 'state + 2')
			);

			await button.click();
			await expectByPolling(() => getText(value), 'Count: 3');
		});

		test('resets hook state', async () => {
			const value = await page.$('.value');

			await updateFile('src/useCounter.js', content =>
				content.replace('useState(0);', 'useState(10);')
			);

			await expectByPolling(() => getText(value), 'Count: 10');
		});
	});
});
