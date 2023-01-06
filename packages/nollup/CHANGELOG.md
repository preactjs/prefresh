# @prefresh/nollup

## 4.0.0

### Major Changes

- [#424](https://github.com/preactjs/prefresh/pull/424) [`61c2b62`](https://github.com/preactjs/prefresh/commit/61c2b624823855a0e8381c5902b1ca22b63f3829) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support Preact v11, this drops support for Preact 10 - to use Preact 10 refer to the v1 release line

### Patch Changes

- Updated dependencies [[`0d42e69`](https://github.com/preactjs/prefresh/commit/0d42e6916f8f37eb79ffe68e33c872b68fa4ede9), [`61c2b62`](https://github.com/preactjs/prefresh/commit/61c2b624823855a0e8381c5902b1ca22b63f3829)]:
  - @prefresh/core@2.0.0
  - @prefresh/utils@2.0.0
  - @prefresh/babel-plugin@1.0.0

## 3.0.2

### Patch Changes

- [`eb9aa93`](https://github.com/preactjs/prefresh/commit/eb9aa932fc2a01fed3ecb662e195422986529419) [#425](https://github.com/preactjs/prefresh/pull/425) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix import paths for newer node versions

- Updated dependencies [[`eb9aa93`](https://github.com/preactjs/prefresh/commit/eb9aa932fc2a01fed3ecb662e195422986529419)]:
  - @prefresh/core@1.3.3
  - @prefresh/utils@1.1.2

## 3.0.1

### Patch Changes

- [`ba56343`](https://github.com/preactjs/prefresh/commit/ba56343d001adf649d4816f9919fcc9e0af85579) [#316](https://github.com/preactjs/prefresh/pull/316) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix non hot-updating node propagation

## 3.0.0

### Patch Changes

- Updated dependencies [[`21f8c43`](https://github.com/preactjs/prefresh/commit/21f8c4330a29edcb5d4493cda5465e6556a5f92c)]:
  - @prefresh/babel-plugin@0.4.0
  - @prefresh/core@1.3.0

## 2.2.0

### Minor Changes

- [`39bcf44`](https://github.com/preactjs/prefresh/commit/39bcf44604c377ca493db9ebce1d75071107704b) [#238](https://github.com/preactjs/prefresh/pull/238) Thanks [@sidujjain](https://github.com/sidujjain)! - Add prototype-check to `@prefresh/utils` isComponent check and utilize this in nollup & webpack

### Patch Changes

- Updated dependencies [[`39bcf44`](https://github.com/preactjs/prefresh/commit/39bcf44604c377ca493db9ebce1d75071107704b), [`bcd6113`](https://github.com/preactjs/prefresh/commit/bcd61138872ca0494b9b480f4b153458997071a0)]:
  - @prefresh/utils@1.1.0
  - @prefresh/core@1.2.0

## 2.1.1

### Patch Changes

- [`dbfa0ed`](https://github.com/preactjs/prefresh/commit/dbfa0ed0f007a10a79bc53acc82ce23ef490138e) [#230](https://github.com/preactjs/prefresh/pull/230) Thanks [@iFwu](https://github.com/iFwu)! - fix runtime node module resolve error. it's necessary to use an explicit extension when import if there's an exports path field in pacakge.json

## 2.1.0

### Patch Changes

- Updated dependencies [[`c0835d5`](https://github.com/preactjs/prefresh/commit/c0835d5c5820809563ec768296a610b45d7dc0c0)]:
  - @prefresh/babel-plugin@0.3.0

## 2.0.2

### Patch Changes

- [`3a831e5`](https://github.com/preactjs/prefresh/commit/3a831e5f90547d3ae836ae50a8ab2ec50f76e7c8) [#231](https://github.com/preactjs/prefresh/pull/231) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix components not being recognised, name should take presedence over displayName

## 2.0.1

### Patch Changes

- [`5bbf5b2`](https://github.com/preactjs/prefresh/commit/5bbf5b2f9b36e672b79f542e88aa981dc130e066) [#223](https://github.com/preactjs/prefresh/pull/223) Thanks [@piotr-cz](https://github.com/piotr-cz)! - Add `.mjs` export for compatability with newer Node versions

## 2.0.0

### Major Changes

- [`cbc79e2`](https://github.com/preactjs/prefresh/commit/cbc79e2c6e11e6965b3fc64f1f880119ce532393) [#188](https://github.com/preactjs/prefresh/pull/188) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove unused code and require @prefresh/babel-plugin

### Patch Changes

- [`b075a8e`](https://github.com/preactjs/prefresh/commit/b075a8ebb7c613b8ce41844d82532803fd61f710) [#190](https://github.com/preactjs/prefresh/pull/190) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove export registration

- Updated dependencies [[`b075a8e`](https://github.com/preactjs/prefresh/commit/b075a8ebb7c613b8ce41844d82532803fd61f710), [`25c683c`](https://github.com/preactjs/prefresh/commit/25c683cf47484ee1612ff0fcd677f788b00d8860)]:
  - @prefresh/core@1.0.0
  - @prefresh/utils@1.0.0

## 1.1.0

### Minor Changes

- [`139db69`](https://github.com/preactjs/prefresh/commit/139db690d307f60ff5224c240158454762bd66f5) [#170](https://github.com/preactjs/prefresh/pull/170) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add class-component support

## 1.0.0

### Major Changes

- [`4020961`](https://github.com/preactjs/prefresh/commit/402096167ad77085d207f705703d7102d5d441a4) [#140](https://github.com/preactjs/prefresh/pull/140) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove the prefresh-check based on exported components and only rely on register passes.

### Patch Changes

- Updated dependencies [[`9e34c74`](https://github.com/preactjs/prefresh/commit/9e34c7408a5307f270681f2c7029180908a5538a)]:
  - @prefresh/core@0.8.1
  - @prefresh/utils@0.3.1

## 0.7.0

### Minor Changes

- [`32b7a6e`](https://github.com/preactjs/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb) [#131](https://github.com/preactjs/prefresh/pull/131) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle non-exported components correctly

### Patch Changes

- Updated dependencies [[`32b7a6e`](https://github.com/preactjs/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb)]:
  - @prefresh/core@0.8.0
  - @prefresh/utils@0.3.0

## 0.6.4

### Patch Changes

- [`23bdb37`](https://github.com/preactjs/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e) [#115](https://github.com/preactjs/prefresh/pull/115) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add .npmignore removing example

- Updated dependencies [[`23bdb37`](https://github.com/preactjs/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e)]:
  - @prefresh/core@0.7.2
  - @prefresh/utils@0.2.1

## 0.6.3

### Patch Changes

- [`1848d91`](https://github.com/preactjs/prefresh/commit/1848d9183aaae7cf1a3da9baeccd27935e7c563d) [#105](https://github.com/preactjs/prefresh/pull/105) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Change `window` to `self` so prefresh works outside of the browser

* [`476c8b8`](https://github.com/preactjs/prefresh/commit/476c8b8ca75fba6e69e046510beb78dfe0e46544) [#107](https://github.com/preactjs/prefresh/pull/107) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Correctly return the function type from the refreshSigning

## 0.6.2

### Patch Changes

- [`f4f2b91`](https://github.com/preactjs/prefresh/commit/f4f2b9111aaf05fd63397c0627386175430500bf) [#88](https://github.com/preactjs/prefresh/pull/88) Thanks [@PepsRyuu](https://github.com/PepsRyuu)! - Transform check from `prefresh` to `@prefresh`

## 0.6.1

### Patch Changes

- Updated dependencies [[`501d8f6`](https://github.com/preactjs/prefresh/commit/501d8f6e62db87099846b80fc4d22185c2e3dad2)]:
  - @prefresh/core@0.7.1

## 0.6.0

### Minor Changes

- [`520acd7`](https://github.com/preactjs/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90) [#69](https://github.com/preactjs/prefresh/pull/69) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add export maps for Node 13/14

### Patch Changes

- Updated dependencies [[`9948be5`](https://github.com/preactjs/prefresh/commit/9948be52120d03992a183f24e9f4ef53a9a27629), [`520acd7`](https://github.com/preactjs/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90)]:
  - @prefresh/core@0.7.0
  - @prefresh/utils@0.2.0

## 0.5.2

### Patch Changes

- Updated dependencies [[`ee56105`](https://github.com/preactjs/prefresh/commit/ee5610575228663c08d40eed17a46064089d0075)]:
  - @prefresh/core@0.6.2

## 0.5.1

### Patch Changes

- [`fe5ad75`](https://github.com/preactjs/prefresh/commit/fe5ad753ec12d091dd6013d51e2f65512643ce3a) [#52](https://github.com/preactjs/prefresh/pull/52) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Improve displayName detection

- Updated dependencies [[`846eec0`](https://github.com/preactjs/prefresh/commit/846eec0a77ba8f9b8e1ea36bfc0dd6a6ad7ba94c)]:

  - @prefresh/utils@0.1.2
