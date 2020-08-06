import { compareSignatures, isComponent, flush } from '@prefresh/utils';

export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		knownEntrypoints: ['@prefresh/core'],
		async transform({ contents, urlPath, isDev }) {
			if (!isDev || !urlPath.endsWith('.js') || config.devOptions.hmr === false)
				return;

			return {
				result: `
          import '@prefresh/core';
          import * as $OriginalModule$ from ${JSON.stringify(urlPath)};
          let $CurrentModule$ = $OriginalModule$;

          const compareSignaturesForPrefreshment = ${compareSignatures.toString()};
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
                for (let i in module) {
                  if (typeof module[i] === 'function') {
                    if (i in $CurrentModule$) {
                      // We could add a check here on i.name if it's a component.
                      compareSignaturesForPrefreshment(
                        $CurrentModule$[i],
                        module[i]
                      );
                    }
                  }
                }

                flushUpdates();
                $CurrentModule$ = module;
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
