import expect from 'expect';
import { setupTest } from './test-helpers.mjs';

export async function run(config) {
	const { page } = await setupTest(config, 'hooks');
  const content = await page.$eval('body', el => el.innerHTML);
	expect(content).toMatch('Hello world');
}
