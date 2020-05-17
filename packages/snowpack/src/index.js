import { isComponent } from '@prefresh/utils';

export default function preactRefreshPlugin(config, pluginOptions) {
  return {
    knownEntrypoints: ['@prefresh/core'],
    async transform({ contents, urlPath, isDev }) {
      if (!isDev || !urlPath.endsWith('.js')) return;

      // TODO: check if we can use `isComponent` on $CurrentModule$
      // so we can skip binding custom-hooks. Hooks won't be supported until the acorn
      // plugi neither way.
      return {
        result: `
          import '@prefresh/core';
          import * as $OriginalModule$ from ${JSON.stringify(urlPath)};
          let $CurrentModule$ = $OriginalModule$;

          ${contents}

          if (import.meta.hot) {
            import.meta.hot.accept(({module}) => {
              try {
                for (let i in module) {
                  self.__PREFRESH__.replaceComponent($CurrentModule$[i], module[i]);
                }
                $CurrentModule$ = module;
              } catch(e) {
                window.location.reload();
              }
            });
          }`,
      };
    },
  };
};
