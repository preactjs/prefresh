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

    await execa('yarn', { cwd: getTempDir(integration) });

    browser = await puppeteer.launch({
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
          console.log('[SERVER LOG]: ', data.toString());
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

  /**
   * Bug reproduction
   *
   * - change text in test1.jsx
   * - press button twice
   * - change text again --> won't go through
   */
  test('Can make change to lazy loaded components', async () => {
    const button = await page.$('.toggle');
    const text1 = await page.$('.test-1');
    await expectByPolling(() => getText(text1), 'Test 1');

    await updateFile('src/test1.jsx', content =>
      content.replace('Test 1', 'Test 1!!!!')
    );

    await timeout(TIMEOUT);
    await expectByPolling(() => getText(text1), 'Test 1!!!');

    await button.click();
    await timeout(TIMEOUT);

    const text2 = await page.$('.test-2');
    await expectByPolling(() => getText(text2), 'Test 2');

    await button.click();
    await timeout(TIMEOUT);

    await expectByPolling(() => getText(text1), 'Test 1!!!');

    await updateFile('src/test1.jsx', content =>
      content.replace('Test 1!!!', 'Test 1!')
    );
    await timeout(TIMEOUT);
    await expectByPolling(() => getText(text1), 'Test 1!');
  });
});
