import MagicString from 'magic-string';
import { transformSync } from '@babel/core';

const PREFRESH = `
if (import.meta.hot) {
  import.meta.hot.accept(async ({module}) => {
    try {
      flushUpdates();
    } catch (e) {
      import.meta.hot.invalidate();
    }
  });
}
`;

export default function wmrPlugin() {
	return {
		name: 'prefresh-wmr-plugin',
		transform(code, id) {
			const ch = id[0];
			if (
				process.env.NODE_ENV === 'production' ||
				ch === '\0' ||
				ch === '\b' ||
				!/\.[tj]sx?$/.test(id)
			)
				return;

			let hasHot = /(import\.meta\.hot|\$IMPORT_META_HOT\$)/.test(code);
			let after = '';

			if (
				code.match(/html`[^`]*<([a-zA-Z][a-zA-Z0-9.:-]*|\$\{.+?\})[^>]*>/) &&
				code.match(/\bexport\b/)
			) {
				hasHot = true;
				after += '\n' + PREFRESH;

				const result = transform(code, id);

				if (!/\$RefreshReg\$\(/.test(result.code)) {
					return { code, map: result.map };
				}

				code = result.code;
			}

			if (!hasHot) return null;

			const s = new MagicString(code, {
				filename: id,
				indentExclusionRanges: undefined
			});

			s.append(after);
			s.prepend(
				`import { createHotContext as $createHotContext$ } from 'wmr';
        const $IMPORT_META_HOT$ = $createHotContext$(import.meta.url);
        import '@prefresh/core';
        import { flushUpdates } from '@prefresh/utils';`
			);

			return {
				code: s.toString(),
				map: s.generateMap({ includeContent: false })
			};
		}
	};
}

const transform = (code, path) =>
	transformSync(code, {
		plugins: [require('@prefresh/babel-plugin')],
		ast: false,
		sourceMaps: true,
		sourceFileName: path
	});
