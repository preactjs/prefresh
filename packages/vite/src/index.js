/** @returns {import('vite').Plugin} */
export default function prefreshPlugin() {
	return {
		transforms: [
			{
				as: 'js',
				test(path, query) {
					if (!/\.[tj]sx$/.test(path)) return false;
					// @ts-ignore
					this.path = path;
					return true;
				},
				// todo: use isImport to ignore `/@modules` requests?
				transform(code, isImport) {
					// The module imports itself to get its current exports, avoiding the need for eval().

					// @ts-ignore
					const spec = JSON.stringify(this.path);

          // Note: prefresh *must* be injected prior to any VNodes being created!
          // TODO: check whether or not we can use @prefresh/utils.isComponent to not bind
          // custom hooks.
					return `
            import '@prefresh/core';
            import { hot } from 'vite/hmr';
            import * as __PSELF__ from ${spec};
            ${code}
            if (__DEV__) {
              let a = 0;
              hot.accept(m => {
                try {
                  if (!a++) for (let i in m) self.__PREFRESH__.replaceComponent(__PSELF__[i], m[i]);
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
