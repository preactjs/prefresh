# @prefresh/babel-plugin

## 0.4.1

### Patch Changes

- [`010f21b`](https://github.com/JoviDeCroock/prefresh/commit/010f21b947d0cdee59fac6af6a17d10cb6a696b5) [#287](https://github.com/JoviDeCroock/prefresh/pull/287) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix createContext detection in React-Preact/compat

## 0.4.0

### Minor Changes

- [`21f8c43`](https://github.com/JoviDeCroock/prefresh/commit/21f8c4330a29edcb5d4493cda5465e6556a5f92c) [#243](https://github.com/JoviDeCroock/prefresh/pull/243) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Invalidate useEffect/useLayoutEffect/useMemo/useCallback without resetting hook-state aggressively, now hook-state will only be reset for stateful hooks.

## 0.3.0

### Minor Changes

- [`c0835d5`](https://github.com/JoviDeCroock/prefresh/commit/c0835d5c5820809563ec768296a610b45d7dc0c0) [#233](https://github.com/JoviDeCroock/prefresh/pull/233) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Calculate hashes for useEffect and useLayoutEffect

## 0.2.2

### Patch Changes

- [`39c60c5`](https://github.com/JoviDeCroock/prefresh/commit/39c60c5862adef106fed1ca59a968f40cdacdd10) [#195](https://github.com/JoviDeCroock/prefresh/pull/195) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix syntax issue preventing babel from correctly assigning defaultValues

## 0.2.1

### Patch Changes

- [`53e79a8`](https://github.com/JoviDeCroock/prefresh/commit/53e79a8bcdf5ef3a9387e46307cfd0ce1a2a3186) [#193](https://github.com/JoviDeCroock/prefresh/pull/193) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix bug where a TSAsExpression would make our transform behave funky

## 0.2.0

### Minor Changes

- [`430fe2c`](https://github.com/JoviDeCroock/prefresh/commit/430fe2c2b281b1973a74c542a38c1bb5be2a6559) [#185](https://github.com/JoviDeCroock/prefresh/pull/185) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add support for registering class components
