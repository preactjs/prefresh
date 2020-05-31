## 0.7.1

### Patch Changes

- [`501d8f6`](https://github.com/JoviDeCroock/prefresh/commit/501d8f6e62db87099846b80fc4d22185c2e3dad2) [#72](https://github.com/JoviDeCroock/prefresh/pull/72) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add "default" to the export map to support CJS modules requiring core

## 0.7.0

### Minor Changes

- [`520acd7`](https://github.com/JoviDeCroock/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90) [#69](https://github.com/JoviDeCroock/prefresh/pull/69) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add export maps for Node 13/14

### Patch Changes

- [`9948be5`](https://github.com/JoviDeCroock/prefresh/commit/9948be52120d03992a183f24e9f4ef53a9a27629) [#67](https://github.com/JoviDeCroock/prefresh/pull/67) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle async errors in nested components

## 0.6.2

### Patch Changes

- [`ee56105`](https://github.com/JoviDeCroock/prefresh/commit/ee5610575228663c08d40eed17a46064089d0075) [#57](https://github.com/JoviDeCroock/prefresh/pull/57) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Graciously handle errors with Preact options

- Some performance refactors

## 0.6.1

- Remove invalid `webpack` peerDependency

## 0.6.0

- Added `computeKey` and `register` to the window payload
  - `computeKey` will calculate a hash for `functional components` and `custom hooks` this will allow you to derive the need for resetting state or not.
  - `register` is a noop that might be used later
- Added a third parameter to `replaceComponent` allowing the user to specify whether or not the stat has to be reset.
