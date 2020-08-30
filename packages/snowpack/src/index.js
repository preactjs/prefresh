export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		knownEntrypoints: ['@prefresh/snowpack/runtime'],
		async transform({ contents, urlPath, isDev }) {
			if (!isDev || !urlPath.endsWith('.js') || config.devOptions.hmr === false)
				return;

      const hasRefeshReg = /\$RefreshReg\$\(/.test(contents)
      const hasRefeshSig = /\$RefreshSig\$\(/.test(contents)
			if (!hasRefeshReg && !hasRefeshSig) {
				return { result: contents };
			}

			return {
				result: `
          ${'import'} '@prefresh/snowpack/runtime';
          ${'import'} { flushUpdates } from '@prefresh/vite/utils';

          const prevRefreshReg = self.$RefreshReg$ || (() => {});
          const prevRefreshSig = self.$RefreshSig$ || (() => {});

          self.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
              return type;
            };
          };

          self.$RefreshReg$ = (type, id) => {
            self.__PREFRESH__.register(type, ${JSON.stringify(
							urlPath
						)} + " " + id);
          };

          ${contents}

          self.$RefreshSig$ = prevRefreshSig;
          self.$RefreshReg$ = prevRefreshReg;

          ${hasRefeshReg && `
          if (import.meta.hot) {
            import.meta.hot.accept(({ module }) => {
              try {
                flushUpdates();
              } catch(e) {
                import.meta.hot.invalidate();
              }
            });
          }
          `}

        `
			};
		}
	};
}
