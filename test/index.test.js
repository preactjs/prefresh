const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const puppeteer = require('puppeteer');

const timeout = n => new Promise(r => setTimeout(r, n));

const integrations = ['vite', 'snowpack'];

const bin = {
	snowpack: path.resolve(
		__dirname,
		`../node_modules/snowpack/dist-node/index.bin.js`
	),
	vite: path.resolve(__dirname, `../node_modules/vite/bin/vite.js`)
};

const binArgs = {
	snowpack: ['dev'],
	vite: []
};

const goMessage = {
	vite: 'running',
	snowpack: 'Server started'
};

const defaultPort = {
	vite: 3000,
	snowpack: 8080
};

const getFixtureDir = integration =>
	path.join(__dirname, '../test/fixture', integration);
const getTempDir = integration => path.join(__dirname, '../temp', integration);
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

integrations.forEach(integration => {
	async function updateFile(file, replacer) {
		const compPath = path.join(getTempDir(integration), file);
		const content = await fs.readFile(compPath, 'utf-8');
		await fs.writeFile(compPath, replacer(content));
	}

	describe(integration, () => {
		let serverLogs = [];
		let browserLogs = [];

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

			console.log('starting dev server...');

			devServer = execa(bin[integration], binArgs[integration], {
				cwd: getTempDir(integration)
			});

			devServer.stderr.on('data', data => {
				console.log('[SERVER LOG]: ', data.toString());
				serverLogs.push(data.toString());
			});

			await new Promise(resolve => {
				devServer.stdout.on('data', data => {
					console.log(
						'check',
						data.toString(),
						data.toString().match(goMessage[integration])
					);
					if (data.toString().match(goMessage[integration])) {
						console.log('dev server running.');
						resolve();
					}
				});
			});

			page = await browser.newPage();
			page.on('console', msg => {
				console.log('[BROWSER LOG]: ', msg);
				browserLogs.push(msg.text());
			});

			await page.goto('http://localhost:' + defaultPort[integration]);
		});

		afterAll(async () => {
			try {
				await fs.remove(getTempDir(integration));
			} catch (e) {}
			if (browser) await browser.close();
			if (devServer) {
				devServer = undefined;
				devServer.kill('SIGTERM', {
					forceKillAfterTimeout: 2000
				});
			}
		});

		test('basic component', async () => {
			const button = await page.$('.button');
			expect(await getText(button)).toMatch('Increment');

			await updateFile('src/app.jsx', content =>
				content.replace('Increment', 'Increment (+)')
			);

			await timeout(500);
			expect(await getText(button)).toMatch('Increment (+)');
		});

		test('custom hook', async () => {
			const value = await page.$('.value');
			const button = await page.$('.button');
			expect(await getText(value)).toMatch('Count: 0');

			await button.evaluate(x => x.click());

			expect(await getText(value)).toMatch('Count: 1');

			await updateFile('src/useCounter.js', content =>
				content.replace('state + 1', 'state + 2')
			);

			await timeout(500);
			await button.evaluate(x => x.click());
			expect(await getText(value)).toMatch('Count: 3');
		});

		test('resets hook state', async () => {
			const value = await page.$('.value');
			expect(await getText(value)).toMatch('Count: 3');

			await updateFile('src/useCounter.js', content =>
				content.replace('useState(0);', 'useState(10);')
			);

			await timeout(500);
			expect(await getText(value)).toMatch('Count: 10');
		});
	});
});
