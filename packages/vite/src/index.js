import { transformSync } from '@babel/core';

/** @returns {import('vite').Plugin} */
export default function prefreshPlugin() {
	return {
		transforms: [
			{
				test: ({ path }) => /\.(t|j)s(x)?$/.test(path),
				transform({ code, isBuild, path }) {
					if (
						isBuild ||
						process.env.NODE_ENV === 'production' ||
						path.includes('node_modules') ||
						path.includes('@modules')
					)
						return code;

					const result = transform(code, path);
					const hasReg = /\$RefreshReg\$\(/.test(result.code);
					const hasSig = /\$RefreshSig\$\(/.test(result.code);

					if (!hasSig && !hasReg) return { code };

					const prelude = `
            ${'import'} '@prefresh/vite/runtime';
            ${'import'} { flushUpdates } from '@prefresh/vite/utils';

            let prevRefreshReg;
            let prevRefreshSig;

            if (import.meta.hot) {
              prevRefreshReg = self.$RefreshReg$ || (() => {});
              prevRefreshSig = self.$RefreshSig$ || (() => {});

              self.$RefreshReg$ = (type, id) => {
                self.__PREFRESH__.register(type, ${JSON.stringify(
									path
								)} + " " + id);
              }

              self.$RefreshSig$ = () => {
                let status = 'begin';
                let savedType;
                return (type, key, forceReset, getCustomHooks) => {
                  if (!savedType) savedType = type;
                  status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
                  return type;
                };
              };
            }
            `;

					if (hasSig && !hasReg) {
						return {
							code: `
                ${prelude}
                ${result.code}
              `,
							map: result.map
						};
					}

					return {
						code: `
            ${prelude}

            ${result.code}

            if (import.meta.hot) {
              self.$RefreshReg$ = prevRefreshReg;
              self.$RefreshSig$ = prevRefreshSig;
              import.meta.hot.accept((m) => {
                try {
                  flushUpdates();
                } catch (e) {
                  self.location.reload();
                }
              });
            }
          `,
						map: result.map
					};
				}
			}
		]
	};
}

const transform = (code, path) =>
	transformSync(code, {
		plugins: [
			[require('@prefresh/babel-plugin-prefresh'), { skipEnvCheck: true }]
		],
		ast: false,
		sourceMaps: true,
		sourceFileName: path
	});
