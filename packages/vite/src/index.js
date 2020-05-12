/** @returns {import('vite').Plugin} */
export default function prefreshPlugin() {
    return {
        transforms: [
            {
                as: 'js',
                test(path, query) {
                    if (!/\.jsx$/.test(path)) return false;
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
                    return `
                        import 'prefresh/packages/core';
                        import { hot } from 'vite/hmr';
                        import * as __PSELF__ from ${spec};
                        ${code}
                        if (__DEV__) {
                            let a = 0;
                            hot.accept(m => {
                                if (!a++) for (let i in m) self.__PREFRESH__.replaceComponent(__PSELF__[i], m[i]);
                            });
                        }
                    `;
                }
            }
        ]
    };
}
