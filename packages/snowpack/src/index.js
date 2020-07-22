import { compareSignatures, isComponent } from '@prefresh/utils';

export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		name: '@prefresh/snowpack',
		input: ['.js'],
		output: ['.js'],
		async build({ contents, isDev }) {
			if (!isDev || config.devOptions.hmr === false) return;

			return {
				result: `
          import '@prefresh/core';

          let prevRefreshReg;
          let prevRefreshSig;
          const module = {};
          const compareSignatures = ${compareSignatures.toString()};

          if (import.meta.hot) {
            prevRefreshReg = self.$RefreshReg$ || (() => {});
            prevRefreshSig = self.$RefreshSig$ || (() => {});

            self.$RefreshReg$ = (type, id) => {
              module[type.name] = type;
            };

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

          ${contents}

          if (import.meta.hot) {
            self.$RefreshSig$ = prevRefreshSig;
            self.$RefreshReg$ = prevRefreshReg;
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
              } catch(e) {
                import.meta.hot.invalidate();
              }
            });
          }
`
			};
		}
	};
}
