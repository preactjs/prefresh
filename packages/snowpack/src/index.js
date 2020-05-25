import { compareSignatures, isComponent } from '@prefresh/utils';

export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		knownEntrypoints: ['@prefresh/core'],
		async transform({ contents, urlPath, isDev }) {
			if (!isDev || !urlPath.endsWith('.js')) return;

			return {
				result: `
          import '@prefresh/core';
          import * as $OriginalModule$ from ${JSON.stringify(urlPath)};
          let $CurrentModule$ = $OriginalModule$;

          const compareSignaturesForPrefreshment = ${compareSignatures.toString()};
          const shouldPrefreshBind = ${isComponent.toString()}

          const __module_exports__ = []

          const prevRefreshReg = window.$RefreshReg$ || (() => {});
          const prevRefreshSig = window.$RefreshSig$ || (() => {});

          window.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = window.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
            };
          };

          window.$RefreshReg$ = (type, id) => {
            __module_exports__.push(type.name);
          };

          ${contents}

          window.$RefreshSig$ = prevRefreshSig;
          window.$RefreshReg$ = prevRefreshReg;

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
