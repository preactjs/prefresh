import expect from 'expect';
import { setupTest } from './test-helpers.mjs';

export async function run(config) {
	const { page } = await setupTest(config, 'hello-world');
	const content = await page.$eval('body', el => el.textContent);
	expect(content).toMatch('Hello world');
}
