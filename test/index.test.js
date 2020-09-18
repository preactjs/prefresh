const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const puppeteer = require('puppeteer');
const {
	expectByPolling,
	getFixtureDir,
	getTempDir,
	timeout
} = require('./utils');
const {
	bin,
	binArgs,
	goMessage,
	defaultPort,
	integrations,
	supportsClassComponents
} = require('./constants');

describe('Prefresh integrations', () => {
	let devServer, browser, page;

	const browserConsoleListener = msg => {
		console.log('[BROWSER LOG]: ', msg);
	};

	let serverConsoleListener;

	integrations.forEach(integration => {
		async function updateFile(file, replacer) {
			const compPath = path.join(getTempDir(integration), file);
			const content = await fs.readFile(compPath, 'utf-8');
			await fs.writeFile(compPath, replacer(content));
		}

		describe(integration, () => {
			const getEl = async selectorOrEl => {
				return typeof selectorOrEl === 'string'
					? await page.$(selectorOrEl)
					: selectorOrEl;
			};

			const getText = async selectorOrEl => {
				const el = await getEl(selectorOrEl);
				return el ? el.evaluate(el => el.textContent) : null;
			};

			jest.setTimeout(100000);

			afterAll(async () => {
				try {
					await fs.remove(getTempDir(integration));
				} catch (e) {}
				page.removeListener('console', browserConsoleListener);

				if (browser) await browser.close();
				if (devServer) {
					devServer.kill('SIGTERM', {
						forceKillAfterTimeout: 2000
					});
				}
			});

			beforeAll(async () => {
				await timeout(2000);
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

				await new Promise((resolve, reject) => {
					devServer.stdout.on(
						'data',
						(serverConsoleListener = data => {
							console.log('[SERVER LOG]: ', data.toString());
							if (data.toString().match(goMessage[integration])) resolve();
						})
					);

					devServer.stderr.on(
						'data',
						(serverConsoleListener = data => {
							console.log('[ERROR SERVER LOG]: ', data.toString());
						})
					);
				});

				page = await browser.newPage();
				page.on('console', browserConsoleListener);

				await page.goto('http://localhost:' + defaultPort[integration]);
			});

			test('basic component', async () => {
				const button = await page.$('.button');
				await expectByPolling(() => getText(button), 'Increment');

				await updateFile('src/app.jsx', content =>
					content.replace('Increment', 'Increment (+)')
				);
				await timeout(1000);

				await expectByPolling(() => getText(button), 'Increment (+)');
			});

			test('add export', async () => {
				const button = await page.$('.button');
				await expectByPolling(() => getText(button), 'Increment (+)');

				await updateFile('src/app.jsx', content => {
					let newContent = content;
					newContent.replace('function Test', 'export function Test');
					newContent.replace('Increment (+)', 'Increment');
					return newContent;
				});
				await timeout(1000);

				await expectByPolling(() => getText(button), 'Increment (+)');
			});

			test('custom hook', async () => {
				const value = await page.$('.value');
				const button = await page.$('.button');
				await expectByPolling(() => getText(value), 'Count: 0');

				await button.click();

				await expectByPolling(() => getText(value), 'Count: 1');

				await updateFile('src/useCounter.js', content =>
					content.replace('state + 1', 'state + 2')
				);
				await timeout(1000);

				await button.click();
				await expectByPolling(() => getText(value), 'Count: 3');

				await updateFile('src/useCounter.js', content =>
					content.replace('useState(0)', 'useState(10)')
				);
				await timeout(1000);

				await expectByPolling(() => getText(value), 'Count: 10');
			});

			test('resets hook state', async () => {
				const value = await page.$('.value');

				await updateFile('src/useCounter.js', content =>
					content.replace('useState(0);', 'useState(10);')
				);
				await timeout(1000);

				await expectByPolling(() => getText(value), 'Count: 10');
			});

			if (supportsClassComponents.includes(integration)) {
				test('works for class-components', async () => {
					const text = await page.$('.class-text');
					await expectByPolling(() => getText(text), "I'm a class component");

					await updateFile('src/greeting.jsx', content =>
						content.replace(
							"I'm a class component",
							"I'm a reloaded class component"
						)
					);
					await timeout(1000);

					await expectByPolling(
						() => getText(text),
						"I'm a reloaded class component"
					);
				});

				test('can change methods', async () => {
					const text = await page.$('.greeting-text');
					const button = await page.$('.greeting-button');
					await expectByPolling(() => getText(text), 'hi');

					await button.click();
					await expectByPolling(() => getText(text), 'bye');

					await updateFile('src/greeting.jsx', content =>
						content.replace(
							"this.setState({ greeting: 'bye' });",
							"this.setState({ greeting: 'hello' });"
						)
					);
					await timeout(1000);

					await button.click();
					await expectByPolling(() => getText(text), 'hello');
				});
			}

			test('can hot reload context', async () => {
				const appleDiv = await page.$('.apple-div');
				await expectByPolling(() => getText(appleDiv), 'apple');

				await appleDiv.click();
				const storeItems = await page.$('.store-items');
				let children = await storeItems.$$('li');
				expect(await getText(children[0])).toMatch('apple');

				await updateFile('src/context.jsx', content =>
					content.replace(
						'if (!items.includes(id)) setItems([...items, id])',
						'setItems([...items, id])'
					)
				);
				await timeout(1000);

				const peachDiv = await page.$('.peach-div');
				await peachDiv.click();
				children = await storeItems.$$('li');
				expect(await getText(children[0])).toMatch('apple');
				expect(await getText(children[1])).toMatch('peach');
			});
		});
	});
});
