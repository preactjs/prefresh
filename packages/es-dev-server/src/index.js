import { transformSync } from '@babel/core';

export default function preactRefreshPlugin(config, pluginOptions) {
	return {
		knownEntrypoints: [
			'@prefresh/es-dev-server/runtime',
			'@prefresh/es-dev-server/utils'
		],
		async transform(context) {
			if (process.env.NODE_ENV === 'production' || !context.response.is('js'))
				return;

			const { code } = transform(context.body, id);

			hasRefeshReg = /\$RefreshReg\$\(/.test(code);
			hasRefeshSig = /\$RefreshSig\$\(/.test(code);
			if (!hasRefeshReg && !hasRefeshSig) {
				return context;
			}

			return {
				body: `
          ${'import'} '@prefresh/es-dev-server/runtime';
          ${'import'} { flushUpdates } from '@prefresh/es-dev-server/utils';

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

          ${code}

          self.$RefreshSig$ = prevRefreshSig;
          self.$RefreshReg$ = prevRefreshReg;

          ${hasRefeshReg &&
						`
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

const transform = (code, id) =>
	transformSync(code, {
		plugins: [[require('@prefresh/babel-plugin'), { skipEnvCheck: true }]],
		cwd: process.cwd(),
		filename: id,
		ast: false,
		compact: false,
		sourceMaps: false,
		configFile: false,
		babelrc: false
	});
