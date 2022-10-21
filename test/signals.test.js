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

describe('Signals', () => {
  const integration = 'vite-signals';
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

  const getInputValue = async selectorOrEl => {
    const el = await getEl(selectorOrEl);
    return el ? el.evaluate(el => el.value) : null;
  };

  async function updateFile(file, replacer) {
    const compPath = path.join(getTempDir(integration), file);
    const content = await fs.readFile(compPath, 'utf-8');
    await fs.writeFile(compPath, replacer(content));
  }

  test('Can increment after HMR', async () => {
    const increment = await page.$('.increment');
    const countValue = await page.$('.value');
    await expectByPolling(() => getText(countValue), 'Count: 0');
    await increment.click();
    await expectByPolling(() => getText(countValue), 'Count: 1');

    await updateFile('src/app.jsx', content =>
      content.replace('Count:', 'count:')
    );

    await timeout(TIMEOUT);
    await expectByPolling(() => getText(countValue), 'count: 1');

    await increment.click();
    await increment.click();
    await increment.click();

    await expectByPolling(() => getText(countValue), 'count: 4');

    await updateFile('src/app.jsx', content =>
      content.replace('count:', 'Count:')
    );
    await timeout(TIMEOUT);

    await increment.click();
    await expectByPolling(() => getText(countValue), 'Count: 5');
  });

  test('Reacts to adjusting the initial value', async () => {
    const countValue = await page.$('.value');

    await updateFile('src/app.jsx', content =>
      content.replace('signal(0)', 'signal(10)')
    );

    await timeout(TIMEOUT);
    await expectByPolling(() => getText(countValue), 'Count: 10');
  });

  test('Can change input values', async () => {
    const input = await page.$('.input');
    await expectByPolling(() => getInputValue(input), 'foo');

    await page.focus('.input');
    await page.keyboard.type('foooo');
    await expectByPolling(() => getInputValue(input), 'foooo');

    await updateFile('src/Input.jsx', content =>
      content.replace("signal('foo')", "signal('bar')")
    );

    await timeout(TIMEOUT);
    await expectByPolling(() => getInputValue(input), 'bar');

    await page.focus('.input');
    await page.keyboard.type('barfoo');
    await expectByPolling(() => getInputValue(input), 'barfoo');
  });
});
