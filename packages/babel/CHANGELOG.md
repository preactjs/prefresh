# @prefresh/babel-plugin

## 0.5.1

### Patch Changes

- [`7e47061`](https://github.com/preactjs/prefresh/commit/7e470614e70915e994937e97245df9914806be86) [#524](https://github.com/preactjs/prefresh/pull/524) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Ensure we accoutn for the filename when hashing

## 0.5.0

### Minor Changes

- [`e641c69`](https://github.com/preactjs/prefresh/commit/e641c69c610c3adeeb5dcb9e912d030a6fbb5229) [#499](https://github.com/preactjs/prefresh/pull/499) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Publish automatically with npm provenance enabled

* [`35e18f7`](https://github.com/preactjs/prefresh/commit/35e18f719cf17415e33cd2ac0ed83031b1f62b44) [#488](https://github.com/preactjs/prefresh/pull/488) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Transform createContext calls that we find within a closure to make them unique

## 0.4.4

### Patch Changes

- [`01bf615`](https://github.com/preactjs/prefresh/commit/01bf615f99f8615d892883c6e47d4f0c94822e89) [#477](https://github.com/preactjs/prefresh/pull/477) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support contexts nested in an object

## 0.4.2

### Patch Changes

- [`eb9aa93`](https://github.com/preactjs/prefresh/commit/eb9aa932fc2a01fed3ecb662e195422986529419) [#425](https://github.com/preactjs/prefresh/pull/425) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix import paths for newer node versions

* [`f39ab40`](https://github.com/preactjs/prefresh/commit/f39ab409a46a7a06f8e892920e407be728fcefa1) [#432](https://github.com/preactjs/prefresh/pull/432) Thanks [@jvdsande](https://github.com/jvdsande)! - Allow curried HOC and any parameter order for HOC

## 0.4.1

### Patch Changes

- [`010f21b`](https://github.com/preactjs/prefresh/commit/010f21b947d0cdee59fac6af6a17d10cb6a696b5) [#287](https://github.com/preactjs/prefresh/pull/287) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix createContext detection in React-Preact/compat

## 0.4.0

### Minor Changes

- [`21f8c43`](https://github.com/preactjs/prefresh/commit/21f8c4330a29edcb5d4493cda5465e6556a5f92c) [#243](https://github.com/preactjs/prefresh/pull/243) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Invalidate useEffect/useLayoutEffect/useMemo/useCallback without resetting hook-state aggressively, now hook-state will only be reset for stateful hooks.

## 0.3.0

### Minor Changes

- [`c0835d5`](https://github.com/preactjs/prefresh/commit/c0835d5c5820809563ec768296a610b45d7dc0c0) [#233](https://github.com/preactjs/prefresh/pull/233) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Calculate hashes for useEffect and useLayoutEffect

## 0.2.2

### Patch Changes

- [`39c60c5`](https://github.com/preactjs/prefresh/commit/39c60c5862adef106fed1ca59a968f40cdacdd10) [#195](https://github.com/preactjs/prefresh/pull/195) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix syntax issue preventing babel from correctly assigning defaultValues

## 0.2.1

### Patch Changes

- [`53e79a8`](https://github.com/preactjs/prefresh/commit/53e79a8bcdf5ef3a9387e46307cfd0ce1a2a3186) [#193](https://github.com/preactjs/prefresh/pull/193) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix bug where a TSAsExpression would make our transform behave funky

## 0.2.0

### Minor Changes

- [`430fe2c`](https://github.com/preactjs/prefresh/commit/430fe2c2b281b1973a74c542a38c1bb5be2a6559) [#185](https://github.com/preactjs/prefresh/pull/185) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add support for registering class components
