# @prefresh/core

## 1.5.9

### Patch Changes

- [`6ad366f68fb445493881c13be98055038aed08a9`](https://github.com/preactjs/prefresh/commit/6ad366f68fb445493881c13be98055038aed08a9) [#599](https://github.com/preactjs/prefresh/pull/599) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Cleanup unmounted vnodes

## 1.5.8

### Patch Changes

- [`ef00e88492e2f75388ce7c293753532afcb8e595`](https://github.com/preactjs/prefresh/commit/ef00e88492e2f75388ce7c293753532afcb8e595) [#590](https://github.com/preactjs/prefresh/pull/590) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add check for last seen vnode in index.js

## 1.5.7

### Patch Changes

- [`c1f1372542cb586643151693c32cc46079150ef7`](https://github.com/preactjs/prefresh/commit/c1f1372542cb586643151693c32cc46079150ef7) [#585](https://github.com/preactjs/prefresh/pull/585) Thanks [@rschristian](https://github.com/rschristian)! - Correct semver range to support _beta_ releases of Preact v11

## 1.5.6

### Patch Changes

- [`071ae156bf2eb715b7369f48c35b0ce5318ebaf3`](https://github.com/preactjs/prefresh/commit/071ae156bf2eb715b7369f48c35b0ce5318ebaf3) [#581](https://github.com/preactjs/prefresh/pull/581) Thanks [@rschristian](https://github.com/rschristian)! - Expand semver ranges to support the upcoming v11 beta release

- [`a896aff2ca548b596c10756f62a9adeb50b5fcbe`](https://github.com/preactjs/prefresh/commit/a896aff2ca548b596c10756f62a9adeb50b5fcbe) [#577](https://github.com/preactjs/prefresh/pull/577) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add support for new bits in \_\_component of v11

- [`7337e7073db08d4bebaad7bbe7ebd6368af46b94`](https://github.com/preactjs/prefresh/commit/7337e7073db08d4bebaad7bbe7ebd6368af46b94) [#583](https://github.com/preactjs/prefresh/pull/583) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Pass error-info onwards

- [`34af6dde0004498a31a32b0daddea9808a9bf3a0`](https://github.com/preactjs/prefresh/commit/34af6dde0004498a31a32b0daddea9808a9bf3a0) [#580](https://github.com/preactjs/prefresh/pull/580) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix potential crash with null vnodes

## 1.5.5

### Patch Changes

- [`73807d24be7ff38cfe111edeaaba8fc8f7a9cb21`](https://github.com/preactjs/prefresh/commit/73807d24be7ff38cfe111edeaaba8fc8f7a9cb21) [#575](https://github.com/preactjs/prefresh/pull/575) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove log from update logic

## 1.5.4

### Patch Changes

- [`dbf8e68`](https://github.com/preactjs/prefresh/commit/dbf8e68afd27f338a683426214f52ed4e453051c) [#571](https://github.com/preactjs/prefresh/pull/571) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix case where Fragment wrapped children loses all references

- [`b0e73ed`](https://github.com/preactjs/prefresh/commit/b0e73ed6d97f6313200922f2914462c0f016313d) [#572](https://github.com/preactjs/prefresh/pull/572) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add descriptions to package.json

## 1.5.3

### Patch Changes

- [`06f97ac`](https://github.com/preactjs/prefresh/commit/06f97ac8dfa17492bab9a1f9d711fba2069d0f48) [#559](https://github.com/preactjs/prefresh/pull/559) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Avoid memory leak by not registering built-in types

## 1.5.2

### Patch Changes

- [`1101d1f`](https://github.com/preactjs/prefresh/commit/1101d1f34c31c58196ffcaa044b9c80625a4ed81) [#514](https://github.com/preactjs/prefresh/pull/514) Thanks [@antran22](https://github.com/antran22)! - add guard for undefined component before accessing parentDom

## 1.5.1

### Patch Changes

- [`9ad0839`](https://github.com/preactjs/prefresh/commit/9ad083939801a5eae6fbb78ec94f58b357667ece) [#505](https://github.com/preactjs/prefresh/pull/505) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Stop invoking setState on unmounted vnodes

* [`9ad0839`](https://github.com/preactjs/prefresh/commit/9ad083939801a5eae6fbb78ec94f58b357667ece) [#505](https://github.com/preactjs/prefresh/pull/505) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix case where a repeatedly called upon component would have a lot of entries in the vnodesForComponent

## 1.5.0

### Minor Changes

- [`e641c69`](https://github.com/preactjs/prefresh/commit/e641c69c610c3adeeb5dcb9e912d030a6fbb5229) [#499](https://github.com/preactjs/prefresh/pull/499) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Publish automatically with npm provenance enabled

## 1.4.1

### Patch Changes

- [`a4f25c2`](https://github.com/preactjs/prefresh/commit/a4f25c25ccec53df522aa9b506a4b2dee973af7d) [#471](https://github.com/preactjs/prefresh/pull/471) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - update signal handling to not dispose all state

## 1.4.0

### Minor Changes

- [`1121bae`](https://github.com/preactjs/prefresh/commit/1121baecfaf9d2206a216f7c7cb2d2ea260540d7) [#470](https://github.com/preactjs/prefresh/pull/470) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support signals that are globally defined

## 1.3.4

### Patch Changes

- [`f89017d`](https://github.com/preactjs/prefresh/commit/f89017df1d9194468dbde4241c6d8431d77d0377) [#447](https://github.com/preactjs/prefresh/pull/447) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - remove async component check

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
