import { isComponent, flush } from '@prefresh/utils';

export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		knownEntrypoints: ['@prefresh/core'],
		async transform({ contents, urlPath, isDev }) {
			if (!isDev || !urlPath.endsWith('.js') || config.devOptions.hmr === false)
				return;

			return {
				result: `
          import '@prefresh/core';

          const shouldPrefreshBind = ${isComponent.toString()}
          const flushUpdates = ${flush.toString()}

          const __module_exports__ = []

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
            __module_exports__.push(type.name);
            self.__PREFRESH__.register(type, ${JSON.stringify(
							urlPath
						)} + " " + id);
          };

          ${contents}

          self.$RefreshSig$ = prevRefreshSig;
          self.$RefreshReg$ = prevRefreshReg;

          if (import.meta.hot && __module_exports__.some(shouldPrefreshBind)) {
            import.meta.hot.accept(({ module }) => {
              try {
                flushUpdates();
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
