import expect from 'expect';
import { setupTest } from './test-helpers.mjs';

export async function run(config) {
	const { page } = await setupTest(config, 'alias');
	const content = await page.$eval('body', el => el.textContent);
	expect(content).toMatch('Aliasing works.');
}
