import { isComponent, flush } from '@prefresh/utils';

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

function registerExports(moduleExports, moduleId) {
  self['__PREFRESH__'].register(moduleExports, moduleId + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') return;

  for (const key in moduleExports) {
    const exportValue = moduleExports[key];
    const typeID = moduleId + ' %exports% ' + key;
    window['__PREFRESH__'].register(exportValue, typeID);
  }
}

const shouldBind = m => {
  let isCitizen = false;
  const moduleExports = getExports(m);

  if (isComponent(moduleExports)) {
    isCitizen = true;
  }

  if (
    moduleExports === undefined ||
    moduleExports === null ||
    typeof moduleExports !== 'object'
  ) {
    isCitizen = isCitizen || false;
  } else {
    for (const key in moduleExports) {
      if (key === '__esModule') continue;

      const exportValue = moduleExports[key];
      if (isComponent(exportValue)) {
        isCitizen = isCitizen || true;
      }
    }
  }

  return isCitizen;
};

export function __$RefreshCheck$__(module) {
  const isCitizen = shouldBind(module);

  if (module.hot) {
    const currentExports = getExports(module);
    const m =
      module.hot.data && module.hot.data.module && module.hot.data.module;

    registerExports(currentExports, module.id);

    if (isCitizen) {
      if (m) {
        try {
          flush();
        } catch (e) {
          self.location.reload();
        }
      }

      module.hot.dispose(function (data) {
        data.module = module;
      });

      module.hot.accept(function () {
        require(module.id);
      });
    }
  }
}
