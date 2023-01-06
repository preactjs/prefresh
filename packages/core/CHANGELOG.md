# @prefresh/core

## 2.0.0

### Major Changes

- [#424](https://github.com/preactjs/prefresh/pull/424) [`61c2b62`](https://github.com/preactjs/prefresh/commit/61c2b624823855a0e8381c5902b1ca22b63f3829) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support Preact v11, this drops support for Preact 10 - to use Preact 10 refer to the v1 release line

### Patch Changes

- [#452](https://github.com/preactjs/prefresh/pull/452) [`0d42e69`](https://github.com/preactjs/prefresh/commit/0d42e6916f8f37eb79ffe68e33c872b68fa4ede9) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix Suspense issue

## 1.3.3

### Patch Changes

- [`eb9aa93`](https://github.com/preactjs/prefresh/commit/eb9aa932fc2a01fed3ecb662e195422986529419) [#425](https://github.com/preactjs/prefresh/pull/425) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix import paths for newer node versions

## 1.3.2

### Patch Changes

- [`0121873`](https://github.com/preactjs/prefresh/commit/01218735288c380a1d7ad6909f5b94bff4c77ead) [#325](https://github.com/preactjs/prefresh/pull/325) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Forward thirth prop for catchError

## 1.3.1

### Patch Changes

- [`c256066`](https://github.com/preactjs/prefresh/commit/c2560664e794bbd50f26d10953b0d63fb563b26c) [#296](https://github.com/preactjs/prefresh/pull/296) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Skip registration of non-function nodes

## 1.3.0

### Minor Changes

- [`21f8c43`](https://github.com/preactjs/prefresh/commit/21f8c4330a29edcb5d4493cda5465e6556a5f92c) [#243](https://github.com/preactjs/prefresh/pull/243) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Invalidate useEffect/useLayoutEffect/useMemo/useCallback without resetting hook-state aggressively, now hook-state will only be reset for stateful hooks.

## 1.2.0

### Minor Changes

- [`bcd6113`](https://github.com/preactjs/prefresh/commit/bcd61138872ca0494b9b480f4b153458997071a0) [#236](https://github.com/preactjs/prefresh/pull/236) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Update oldVnodeTypes in place with newer equivalents

## 1.1.1

### Patch Changes

- [`b8678d0`](https://github.com/preactjs/prefresh/commit/b8678d036cb02c7b3b9901b2057ba04a4f4c1041) [#206](https://github.com/preactjs/prefresh/pull/206) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Improve cleanup detection

## 1.1.0

### Minor Changes

- [`ac7c5d1`](https://github.com/preactjs/prefresh/commit/ac7c5d150bcbb9cea40060549b31a2ed06fcc5dc) [#202](https://github.com/preactjs/prefresh/pull/202) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Cleanup effects when resetting hooks state

## 1.0.0

### Major Changes

- [`b075a8e`](https://github.com/preactjs/prefresh/commit/b075a8ebb7c613b8ce41844d82532803fd61f710) [#190](https://github.com/preactjs/prefresh/pull/190) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove export registration

## 0.8.1

### Patch Changes

- [`9e34c74`](https://github.com/preactjs/prefresh/commit/9e34c7408a5307f270681f2c7029180908a5538a) [#143](https://github.com/preactjs/prefresh/pull/143) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Cleanup utils and core code

## 0.8.0

### Minor Changes

- [`32b7a6e`](https://github.com/preactjs/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb) [#131](https://github.com/preactjs/prefresh/pull/131) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle non-exported components correctly

## 0.7.4

### Patch Changes

- [`ff43e20`](https://github.com/preactjs/prefresh/commit/ff43e2029f88fd2bc3103539b7d0a50bde42ce25) [#132](https://github.com/preactjs/prefresh/pull/132) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix mistake where the signature for custom hooks would always override itself

## 0.7.3

### Patch Changes

- [`f645aaa`](https://github.com/preactjs/prefresh/commit/f645aaa8da7ec8b1596ec537059a78a8fc630e00) [#128](https://github.com/preactjs/prefresh/pull/128) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Perform initial registration in core to avoid type without a signature

## 0.7.2

### Patch Changes

- [`23bdb37`](https://github.com/preactjs/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e) [#115](https://github.com/preactjs/prefresh/pull/115) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add .npmignore removing example

## 0.7.1

### Patch Changes

- [`501d8f6`](https://github.com/preactjs/prefresh/commit/501d8f6e62db87099846b80fc4d22185c2e3dad2) [#72](https://github.com/preactjs/prefresh/pull/72) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add "default" to the export map to support CJS modules requiring core

## 0.7.0

### Minor Changes

- [`520acd7`](https://github.com/preactjs/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90) [#69](https://github.com/preactjs/prefresh/pull/69) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add export maps for Node 13/14

### Patch Changes

- [`9948be5`](https://github.com/preactjs/prefresh/commit/9948be52120d03992a183f24e9f4ef53a9a27629) [#67](https://github.com/preactjs/prefresh/pull/67) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle async errors in nested components

## 0.6.2

### Patch Changes

- [`ee56105`](https://github.com/preactjs/prefresh/commit/ee5610575228663c08d40eed17a46064089d0075) [#57](https://github.com/preactjs/prefresh/pull/57) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Graciously handle errors with Preact options

- Some performance refactors

## 0.6.1

- Remove invalid `webpack` peerDependency

## 0.6.0

- Added `computeKey` and `register` to the window payload
  - `computeKey` will calculate a hash for `functional components` and `custom hooks` this will allow you to derive the need for resetting state or not.
  - `register` is a noop that might be used later
- Added a third parameter to `replaceComponent` allowing the user to specify whether or not the stat has to be reset.
