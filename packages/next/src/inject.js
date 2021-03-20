import RefreshHelpers from './helpers';

self.$RefreshHelpers$ = RefreshHelpers;

self.$intercept$ = function (moduleId) {
  var prevRefreshReg = self.$RefreshReg$;
  var prevRefreshSig = self.$RefreshSig$;

  self.$RefreshReg$ = function (type, id) {
    self.__PREFRESH__.register(type, moduleId + ' ' + id);
  };

  self.$RefreshSig$ = function () {
    var status = 'begin';
    var savedType;
    return function (type, key, forceReset, getCustomHooks) {
      if (!savedType) savedType = type;
      status = self.__PREFRESH__.sign(
        type || savedType,
        key,
        forceReset,
        getCustomHooks,
        status
      );
      return type;
    };
  };

  return function () {
    self.$RefreshReg$ = prevRefreshReg;
    self.$RefreshSig$ = prevRefreshSig;
  };
};
