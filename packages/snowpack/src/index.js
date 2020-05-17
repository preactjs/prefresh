import { compareSignatures /*, isComponent*/ } from '@prefresh/utils';

export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		knownEntrypoints: ['@prefresh/core'],
		async transform({ contents, urlPath, isDev }) {
			if (!isDev || !urlPath.endsWith('.js')) return;

			// TODO: only bind components with isComponent
			return {
				result: `
          import '@prefresh/core';
          import * as $OriginalModule$ from ${JSON.stringify(urlPath)};
          let $CurrentModule$ = $OriginalModule$;

          const compareSignaturesForPrefreshment = ${compareSignatures.toString()};

          window.$RefreshSig$ = () => {
            let status = 'begin';
            let savedType;
            return (type, key, forceReset, getCustomHooks) => {
              if (!savedType) savedType = type;
              status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
            };
          };

          window.$RefreshReg$ = (type, id) => {
            self.__PREFRESH__.register(type, module.i + ' ' + id);
          };

          ${contents}

          conosle.log($CurrentModule$, import)
          if (import.meta.hot) {
            import.meta.hot.accept(({ module }) => {
              try {
                for (let i in module) {
                  if (typeof module[i] === 'function') {
                    if (i in $CurrentModule$) {
                      compareSignaturesForPrefreshment(
                        $CurrentModule$[i],
                        module[i]
                      );
                    }
                  }
                }
                $CurrentModule$ = module;
              } catch(e) {
                window.location.reload();
              }
            });
          }`
			};
		}
	};
}
