import { RefreshRuntimeGlobals } from '../helpers';

export default function () {
  if (typeof self !== 'undefined' && '$RefreshHelpers$' in self) {
    var currentExports = module.__proto__.exports;
    const previousHotModuleExports =
      module.hot.data && module.hot.data.moduleExports;

    self.$RefreshHelpers$.registerExports(currentExports, module.id);

    if (self.$RefreshHelpers$.isBoundary(currentExports)) {
      module.hot.dispose(function (data) {
        data.moduleExports = currentExports;
      });

      module.hot.accept(function errorRecovery() {
        require.cache[module.id].hot.accept(errorRecovery);
      });

      if (previousHotModuleExports) {
        try {
          __prefresh_utils__.flush();
        } catch (e) {
          if (module.hot.invalidate) {
            module.hot.invalidate();
          } else {
            self.location.reload();
          }
        }
      }
    } else {
      if (previousHotModuleExports) {
        if (module.hot.invalidate) {
          module.hot.invalidate();
        } else {
          self.location.reload();
        }
      }
    }
  }
}
