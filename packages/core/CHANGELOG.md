## 0.6.2

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
