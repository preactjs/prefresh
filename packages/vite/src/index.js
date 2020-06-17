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

					if (!/\$RefreshReg\$\(/.test(result.code)) {
						return code;
					}

					return `
            ${'import'} '@prefresh/vite/runtime';
            ${'import'} { compareSignatures } from '@prefresh/vite/utils';

            let prevRefreshReg;
            let prevRefreshSig;
            const module = {};

            if (import.meta.hot) {
              prevRefreshReg = self.$RefreshReg$ || (() => {});
              prevRefreshSig = self.$RefreshSig$ || (() => {});

              self.$RefreshReg$ = (type, id) => {
                module[type.name] = type;
              }

              self.$RefreshSig$ = () => {
                let status = 'begin';
                let savedType;
                return (type, key, forceReset, getCustomHooks) => {
                  if (!savedType) savedType = type;
                  status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
                };
              };
            }

            ${result.code}

            if (import.meta.hot) {
              self.$RefreshReg$ = prevRefreshReg;
              self.$RefreshSig$ = prevRefreshSig;
              import.meta.hot.accept((m) => {
                try {
                  for (let i in m) {
                    if (i === 'default') {
                      const keyword = m[i].name;
                      compareSignatures(module[keyword], m[i]);
                    } else {
                      compareSignatures(module[i], m[i]);
                    }
                  }
                } catch (e) {
                  self.location.reload();
                }
              });
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
