import { isComponent } from '@prefresh/utils';

// Copied from Next.js/react-refresh-utils
function isSafeExport(key) {
  return (
    key === '__esModule' ||
    key === '__N_SSG' ||
    key === '__N_SSP' ||
    key === 'config'
  );
}

function registerExports(moduleExports, moduleID) {
  self.__PREFRESH__.register(moduleExports, moduleID + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') {
    return;
  }
  for (var key in moduleExports) {
    if (isSafeExport(key)) continue;
    var exportValue = moduleExports[key];
    var typeID = moduleID + ' %exports% ' + key;
    self.__PREFRESH__.register(exportValue, typeID);
  }
}

function isBoundary(moduleExports) {
  if (isComponent(moduleExports)) return true;

  if (moduleExports == null || typeof moduleExports !== 'object') return false;

  var hasExports = false;
  var areAllExportsComponents = true;

  for (var key in moduleExports) {
    hasExports = true;
    if (isSafeExport(key)) {
      continue;
    }

    var exportValue = moduleExports[key];
    if (!isComponent(exportValue)) {
      areAllExportsComponents = false;
    }
  }

  return hasExports && areAllExportsComponents;
}

export default {
  registerExports: registerExports,
  isBoundary: isBoundary,
};
