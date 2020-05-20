import { transformSync } from '@babel/core';

/** @returns {import('vite').Plugin} */
export default function prefreshPlugin() {
	return {
		transforms: [
			{
				test: path => /\.(t|j)s(x)?$/.test(path),
				transform(code, _, isBuild, path) {
					if (
						isBuild ||
						process.env.NODE_ENV === 'production' ||
						path.includes('@modules')
					)
						return code;

					const result = transform(code);
					const shouldBind = result.code.includes('$RefreshReg$(');

					return `
            ${
							shouldBind
								? `
              import '@prefresh/core';
              import { compareSignatures } from '@prefresh/utils';
              import { hot } from 'vite/hmr';
            `
								: ''
						}

            const prevRefreshReg = window.$RefreshReg$ || (() => {});
            const prevRefreshSig = window.$RefreshSig$ || (() => {});

            const module = {};

            window.$RefreshReg$ = (type, id) => {
              module[type.name] = type;
            }

            window.$RefreshSig$ = () => {
              let status = 'begin';
              let savedType;
              return (type, key, forceReset, getCustomHooks) => {
                if (!savedType) savedType = type;
                status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
              };
            };

            ${result.code}

            if (__DEV__) {
              window.$RefreshReg$ = prevRefreshReg;
              window.$RefreshSig$ = prevRefreshSig;
              ${
								shouldBind
									? `
                hot.accept((m) => {
                  try {
                    for (let i in m) {
                      compareSignatures(module[i], m[i]);
                    }
                  } catch (e) {
                    window.location.reload();
                  }
                });
              `
									: ''
							}
            }
          `;
				}
			}
		]
	};
}

const transform = code =>
	transformSync(code, {
		plugins: [require('react-refresh/babel')],
		ast: false,
		sourceMaps: false
	});
