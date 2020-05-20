const preparation = `
const prevRefreshReg = window.$RefreshReg$ || (() => {});
const prevRefreshSig = window.$RefreshSig$ || (() => {});
`;

const signatureRegistration = `
window.$RefreshSig$ = () => {
  let status = 'begin';
  let savedType;
  return (type, key, forceReset, getCustomHooks) => {
    if (!savedType) savedType = type;
    status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
  };
};
`;

const cleanup = `
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
`;

/** @returns {import('vite').Plugin} */
export default function prefreshPlugin() {
	return {
		transforms: [
			{
				test: path => /\.(t|j)s$/.test(path),
				transform(code, _, isBuild, path) {
					if (
						isBuild ||
						process.env.NODE_ENV === 'production' ||
						path.includes('@modules')
					)
						return code;

					const result = require('@babel/core').transformSync(code, {
						plugins: [require('react-refresh/babel')],
						ast: false,
						sourceMaps: false
					});

					return `
            ${preparation}

            window.$RefreshReg$ = (type, id) => {}

            ${signatureRegistration}

            ${result.code}

            if (__DEV__) {
              ${cleanup}
            }
          `;
				}
			},
			{
				test: path => /\.(t|j)sx$/.test(path),
				transform(code, _, isBuild, path) {
					if (
						isBuild ||
						process.env.NODE_ENV === 'production' ||
						path.includes('@modules')
					)
						return code;

					const spec = JSON.stringify(path);

					const result = require('@babel/core').transformSync(code, {
						plugins: [require('react-refresh/babel')],
						ast: false,
						sourceMaps: false
					});

					return `
            import '@prefresh/core';
            import { compareSignatures, isComponent } from '@prefresh/utils';
            import { hot } from 'vite/hmr';
            import * as __PSELF__ from ${spec};

            ${preparation}

            const module = {};
            let hasComponents = false;

            window.$RefreshReg$ = (type, id) => {
              module[type.name] = type;
              if (isComponent(type.name)) hasComponents = true;
            }

            ${signatureRegistration}

            ${result.code}

            if (__DEV__) {
              ${cleanup}
              hot.accept((m) => {
                try {
                  for (let i in m) {
                    compareSignatures(module[i], m[i]);
                  }
                } catch (e) {
                  window.location.reload();
                }
              });
            }
          `;
				}
			}
		]
	};
}
