# @prefresh/webpack

## 1.0.0

### Major Changes

- [`4020961`](https://github.com/JoviDeCroock/prefresh/commit/402096167ad77085d207f705703d7102d5d441a4) [#140](https://github.com/JoviDeCroock/prefresh/pull/140) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove the prefresh-check based on exported components and only rely on register passes.

### Patch Changes

- Updated dependencies [[`9e34c74`](https://github.com/JoviDeCroock/prefresh/commit/9e34c7408a5307f270681f2c7029180908a5538a)]:
  - @prefresh/core@0.8.1
  - @prefresh/utils@0.3.1

## 0.9.1

### Patch changes

- Fix incompatability with html-webpack plugin

## 0.9.0

### Minor Changes

- [`32b7a6e`](https://github.com/JoviDeCroock/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb) [#131](https://github.com/JoviDeCroock/prefresh/pull/131) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle non-exported components correctly

* [`f149103`](https://github.com/JoviDeCroock/prefresh/commit/f14910348f97d39a16d156879578b9e1b90c7e2a) [#139](https://github.com/JoviDeCroock/prefresh/pull/139) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support webpack 5

### Patch Changes

- Updated dependencies [[`32b7a6e`](https://github.com/JoviDeCroock/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb)]:
  - @prefresh/core@0.8.0
  - @prefresh/utils@0.3.0

## 0.8.2

### Patch Changes

- [`23bdb37`](https://github.com/JoviDeCroock/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e) [#115](https://github.com/JoviDeCroock/prefresh/pull/115) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add .npmignore removing example

- Updated dependencies [[`23bdb37`](https://github.com/JoviDeCroock/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e)]:
  - @prefresh/core@0.7.2
  - @prefresh/utils@0.2.1

## 0.8.1

### Patch Changes

- [`1848d91`](https://github.com/JoviDeCroock/prefresh/commit/1848d9183aaae7cf1a3da9baeccd27935e7c563d) [#105](https://github.com/JoviDeCroock/prefresh/pull/105) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Change `window` to `self` so prefresh works outside of the browser

* [`476c8b8`](https://github.com/JoviDeCroock/prefresh/commit/476c8b8ca75fba6e69e046510beb78dfe0e46544) [#107](https://github.com/JoviDeCroock/prefresh/pull/107) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Correctly return the function type from the refreshSigning

## 0.8.0

### Minor Changes

- [`520acd7`](https://github.com/JoviDeCroock/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90) [#69](https://github.com/JoviDeCroock/prefresh/pull/69) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add export maps for Node 13/14

### Patch Changes

- [`cdc44c3`](https://github.com/JoviDeCroock/prefresh/commit/cdc44c3d18ff387675725e72dc217a7794ac3993) [#65](https://github.com/JoviDeCroock/prefresh/pull/65) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Bump @prefresh/core and utils in the webpack integration

- Updated dependencies [[`9948be5`](https://github.com/JoviDeCroock/prefresh/commit/9948be52120d03992a183f24e9f4ef53a9a27629), [`520acd7`](https://github.com/JoviDeCroock/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90)]:
  - @prefresh/core@0.7.0
  - @prefresh/utils@0.2.0

## 0.7.1

### Patch Changes

- [`fe5ad75`](https://github.com/JoviDeCroock/prefresh/commit/fe5ad753ec12d091dd6013d51e2f65512643ce3a) [#52](https://github.com/JoviDeCroock/prefresh/pull/52) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Improve displayName detection

- Updated dependencies [[`846eec0`](https://github.com/JoviDeCroock/prefresh/commit/846eec0a77ba8f9b8e1ea36bfc0dd6a6ad7ba94c)]:
  - @prefresh/utils@0.1.2

## 0.7.0

### Minor Changes

- [`9557162`](https://github.com/JoviDeCroock/prefresh/commit/95571624e2416190c2e07560fe871084b7cbc5fd) [#34](https://github.com/JoviDeCroock/prefresh/pull/34) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Make use of the "module.hot.invalidate" API when it's available, this will replace a full window reload when errors are thrown.
