import tmp from 'tmp-promise';
import path from 'path';
import ncpCb from 'ncp';
import childProcess from 'child_process';
import { promisify } from 'util';
import { onTeardown } from 'pentf/runner';
import { newPage } from 'pentf/browser_utils';

import { fileURLToPath } from 'url';

export const __dirname = url => path.dirname(fileURLToPath(url));

const ncp = promisify(ncpCb);

export async function loadFixture(name, tmp) {
	const fixture = path.join(__dirname(import.meta.url), 'fixtures', name);
	await ncp(fixture, tmp);
}

export async function setupTest(config, fixture, { open = true } = {}) {
	const cwd = await tmp.dir({ unsafeCleanup: true });
	onTeardown(config, () => cwd.cleanup());

	if (fixture) {
		await loadFixture(fixture, cwd.path);
	}

	let instance;
	let page;
	if (open) {
		instance = await runVite(config, cwd.path);
		page = await openVite(config, instance);
	}

	return { tmp: cwd, instance, page };
}

export async function waitForVite(instance) {
	await waitForMessage(instance.output, /running at/);
	return instance.output.join('\n').match(/https?:\/\/localhost:\d+/g)[0];
}

export async function openVite(config, instance) {
	const addr = await waitForVite(instance);
	const page = await newPage(config);
	await page.goto(addr);
	return page;
}

export async function runVite(config, cwd, ...args) {
	const bin = path.join(__dirname(import.meta.url), '..', 'node_modules', '.bin', 'vite');
	const child = childProcess.spawn('node', ['--experimental-modules', bin, ...args], {
		cwd
	});

	const out = {
		output: [],
		code: 0,
		close: () => child.kill()
	};

	function onOutput(buffer) {
		const raw = stripColors(buffer.toString('utf-8'));
		const lines = raw.split('\n').filter(line => !/\(node:\d+\) ExperimentalWarning:/.test(line) && line);
		out.output.push(...lines);
		if (/\b([A-Z][a-z]+)?Error\b/m.test(raw)) {
			console.error(`Error running "wmr ${args.join(' ')}":\n${raw}`);
		}
	}
	child.stdout.on('data', onOutput);
	child.stderr.on('data', onOutput);
	child.on('close', code => (out.code = code));

	await waitFor(() => out.output.length > 0, 10000);

	onTeardown(config, () => child.kill());

	return out;
}

// eslint-disable-next-line no-control-regex
const stripColors = str => str.replace(/\x1b\[(?:[0-9]{1,3}(?:;[0-9]{1,3})*)?[m|K]/g, '');

export const wait = ms => new Promise(r => setTimeout(r, ms));

export async function waitFor(fn, timeout = 2000) {
	const start = Date.now();

	while (start + timeout >= Date.now()) {
		const result = await fn();
		if (result) return true;

		// Wait a little before the next iteration
		await wait(10);
	}

	return false;
}

export async function waitForMessage(haystack, message, timeout = 5000) {
	const found = await waitFor(() => {
		if (typeof message === 'string') {
			if (haystack.includes(message)) {
				return true;
			}
		} else {
			for (let i = 0; i < haystack.length; i++) {
				if (message.test(haystack[i])) {
					return true;
				}
			}
		}

		return false;
	});

	if (!found) {
		throw new Error(`Message ${message} didn't appear in ${timeout}ms`);
	}
}
