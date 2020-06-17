import { compareSignatures, isComponent } from '@prefresh/utils';

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

          const __module_exports__ = []

          const prevRefreshReg = self.$RefreshReg$ || (() => {});
          const prevRefreshSig = self.$RefreshSig$ || (() => {});

          self.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
            };
          };

          self.$RefreshReg$ = (type, id) => {
            __module_exports__.push(type.name);
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
