import * as pentf from 'pentf';
import { __dirname } from './test-helpers.mjs';

pentf.main({
	rootDir: __dirname(import.meta.url),
	testsDir: __dirname(import.meta.url)
});
