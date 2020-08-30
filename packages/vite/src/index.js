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

					if (!/\$RefreshReg\$\(/.test(result.code)) {
						return code;
					}

					return {
						code: `
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
		plugins: [[require('react-refresh/babel'), { skipEnvCheck: true }]],
		ast: false,
		sourceMaps: true,
		sourceFileName: path
	});
