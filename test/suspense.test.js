const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const puppeteer = require('puppeteer');
const {
  expectByPolling,
  getFixtureDir,
  getTempDir,
  timeout,
} = require('./utils');
const { bin, binArgs, goMessage, defaultPort } = require('./constants');

const TIMEOUT = 1000;

describe('Suspense', () => {
  const integration = 'vite-preact-compat';
  let devServer, browser, page, serverConsoleListener;

  const browserConsoleListener = msg => {
    console.log('[BROWSER LOG]: ', msg);
  };

  jest.setTimeout(100000);

  afterAll(async () => {
    if (process.env.DEBUG)
      page.removeListener('console', browserConsoleListener);

    if (browser) await browser.close();
    if (devServer) {
      devServer.kill('SIGTERM', {
        forceKillAfterTimeout: 0,
      });
    }

    try {
      await fs.remove(getTempDir(integration));
    } catch (e) {}
  });

  beforeAll(async () => {
    await timeout(2000);
    try {
      await fs.remove(getTempDir(integration));
    } catch (e) {}

    await fs.copy(getFixtureDir(integration), getTempDir(integration), {
      filter: file => !/dist|node_modules/.test(file),
    });

    await execa('pnpm', { cwd: getTempDir(integration) });

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();

    devServer = execa(
      bin[integration](getTempDir(integration)),
      binArgs[integration],
      {
        cwd: getTempDir(integration),
      }
    );

    await new Promise(resolve => {
      devServer.stdout.on(
        'data',
        (serverConsoleListener = data => {
          if (process.env.DEBUG) console.log('[SERVER LOG]: ', data.toString());
          if (data.toString().match(goMessage[integration])) {
            resolve();
          }
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
    if (process.env.DEBUG) page.on('console', browserConsoleListener);

    await page.goto('http://localhost:' + defaultPort[integration]);
  });

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
    const compPath = path.join(getTempDir(integration), file);
    const content = await fs.readFile(compPath, 'utf-8');
    await fs.writeFile(compPath, replacer(content));
  }

  test('Can make change to lazy loaded components', async () => {
    const button = await page.$('.toggle');
    let text1 = await page.$('.test-1');
    await expectByPolling(() => getText(text1), 'Test 1');

    await updateFile('src/test1.jsx', content =>
      content.replace('Test 1', 'Test 1!!!')
    );

    await timeout(TIMEOUT);
    await expectByPolling(() => getText(text1), 'Test 1!!!');

    await button.click();
    await timeout(TIMEOUT);

    const text2 = await page.$('.test-2');
    await expectByPolling(() => getText(text2), 'Test 2');

    await button.click();
    await timeout(TIMEOUT);

    text1 = await page.$('.test-1');
    await expectByPolling(() => getText(text1), 'Test 1!!!');

    await updateFile('src/test1.jsx', content =>
      content.replace('Test 1!!!', 'Test 1!')
    );
    await timeout(TIMEOUT);
    await expectByPolling(() => getText(text1), 'Test 1!');
  });
});
