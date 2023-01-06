# @prefresh/vite

## 3.0.0

### Major Changes

- [#424](https://github.com/preactjs/prefresh/pull/424) [`61c2b62`](https://github.com/preactjs/prefresh/commit/61c2b624823855a0e8381c5902b1ca22b63f3829) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support Preact v11, this drops support for Preact 10 - to use Preact 10 refer to the v1 release line

### Patch Changes

- Updated dependencies [[`0d42e69`](https://github.com/preactjs/prefresh/commit/0d42e6916f8f37eb79ffe68e33c872b68fa4ede9), [`61c2b62`](https://github.com/preactjs/prefresh/commit/61c2b624823855a0e8381c5902b1ca22b63f3829)]:
  - @prefresh/core@2.0.0
  - @prefresh/utils@2.0.0
  - @prefresh/babel-plugin@1.0.0

## 2.2.7

### Patch Changes

- [`eb9aa93`](https://github.com/preactjs/prefresh/commit/eb9aa932fc2a01fed3ecb662e195422986529419) [#425](https://github.com/preactjs/prefresh/pull/425) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix import paths for newer node versions

- Updated dependencies [[`eb9aa93`](https://github.com/preactjs/prefresh/commit/eb9aa932fc2a01fed3ecb662e195422986529419), [`f39ab40`](https://github.com/preactjs/prefresh/commit/f39ab409a46a7a06f8e892920e407be728fcefa1)]:
  - @prefresh/babel-plugin@0.4.2
  - @prefresh/core@1.3.3
  - @prefresh/utils@1.1.2

## 2.2.6

### Patch Changes

- [`8e9d7f9`](https://github.com/preactjs/prefresh/commit/8e9d7f9d0d94f3c025e78249a80531260b68d5ba) [#412](https://github.com/preactjs/prefresh/pull/412) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix issue where options would be undefined

## 2.2.5

### Patch Changes

- [`a53d9a1`](https://github.com/preactjs/prefresh/commit/a53d9a191d208b9b36b9bac433c30f38ccc61e37) [#405](https://github.com/preactjs/prefresh/pull/405) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add support for 2.7.0

## 2.2.4

### Patch Changes

- [`718d212`](https://github.com/preactjs/prefresh/commit/718d21209365bdf298e858d8792b1334c442840a) [#395](https://github.com/preactjs/prefresh/pull/395) Thanks [@NotWoods](https://github.com/NotWoods)! - Include all options in vite typings

## 2.2.3

### Patch Changes

- [`9f4f98b`](https://github.com/preactjs/prefresh/commit/9f4f98bb9c5f4fb77e6b2bf78888c039d4145ada) [#352](https://github.com/preactjs/prefresh/pull/352) Thanks [@TobiasMelen](https://github.com/TobiasMelen)! - Concatenate inserted prelude to first line of script for sourcemaps

  Prelude and footer code blocks are not supplied to babel sourcemap generation and new lines in them will offset sourcemaps.
  This patch concatenates all of the prelude onto first line of module source to keep source map line mappings the same.
  Footer is unchanged, but since it's at the end of the file it will not offset any code.

## 2.2.2

### Patch Changes

- [`946ea26`](https://github.com/preactjs/prefresh/commit/946ea26174a4b55f27757bca92871a1a177f00df) [#330](https://github.com/preactjs/prefresh/pull/330) Thanks [@cyyynthia](https://github.com/cyyynthia)! - Fix compatibility issues with pnpm (#328)

## 2.2.1

### Patch Changes

- [`aff0aa2`](https://github.com/preactjs/prefresh/commit/aff0aa2a1b252dd2f6aecabdfaeb4ca4ad61201e) [#322](https://github.com/preactjs/prefresh/pull/322) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - update typings, make options optional

## 2.2.0

### Minor Changes

- [`34ac439`](https://github.com/preactjs/prefresh/commit/34ac439cb0ea64a4f062490b1fde4b03da80b641) [#320](https://github.com/preactjs/prefresh/pull/320) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add `parserPlugins` to the `options` object, this allows the addition of [plugins](https://babeljs.io/docs/en/babel-parser#plugins)

## 2.1.1

### Patch Changes

- [`501c906`](https://github.com/preactjs/prefresh/commit/501c906a02db861052f2da1d39f8adf98274655b) [#298](https://github.com/preactjs/prefresh/pull/298) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove optimizeDeps

* [`85119bd`](https://github.com/preactjs/prefresh/commit/85119bd4f14bfdad3e4ba995c61d5808a482ce57) [#297](https://github.com/preactjs/prefresh/pull/297) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Enable esm

* Updated dependencies [[`c256066`](https://github.com/preactjs/prefresh/commit/c2560664e794bbd50f26d10953b0d63fb563b26c), [`010f21b`](https://github.com/preactjs/prefresh/commit/010f21b947d0cdee59fac6af6a17d10cb6a696b5)]:
  - @prefresh/core@1.3.1
  - @prefresh/babel-plugin@0.4.1

## 2.1.0

### Minor Changes

- [`f28edb0`](https://github.com/preactjs/prefresh/commit/f28edb079645ffefc94b4d597ce6aeb30ccffcec) [#270](https://github.com/preactjs/prefresh/pull/270) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Allow using include/exclude in the vite plugin options

### Patch Changes

- [`1f71a37`](https://github.com/preactjs/prefresh/commit/1f71a374cb3ee3ebb2abbc52dcfd82c55dcf717d) [#273](https://github.com/preactjs/prefresh/pull/273) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - (vite) - avoid ssr injection

## 2.0.4

### Patch Changes

- [`2db550d`](https://github.com/preactjs/prefresh/commit/2db550d4d8078a6f011376f60e0b07652d68d311) [#267](https://github.com/preactjs/prefresh/pull/267) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix worker support

## 2.0.3

### Patch Changes

- [`635b538`](https://github.com/preactjs/prefresh/commit/635b538cc308046b2ebfdecad26ff807c53c6cbb) [#264](https://github.com/preactjs/prefresh/pull/264) Thanks [@yyx990803](https://github.com/yyx990803)! - exclude prefresh internals from dep optimization

## 2.0.2

### Patch Changes

- [`8d88d24`](https://github.com/preactjs/prefresh/commit/8d88d247cf1d05b5f4628318e39efa4be9c6baa0) [#256](https://github.com/preactjs/prefresh/pull/256) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Default `\$refreshSig# @prefresh/vite to a proper HOC

## 2.0.1

### Patch Changes

- [`e3e8c84`](https://github.com/preactjs/prefresh/commit/e3e8c84980eed44190f564a25070a6c6519f808c) [#251](https://github.com/preactjs/prefresh/pull/251) Thanks [@itsMapleLeaf](https://github.com/itsMapleLeaf)! - Prevent detection of babel configs in the user's project

## 2.0.0

### Major Changes

- [`bf4cf02`](https://github.com/preactjs/prefresh/commit/bf4cf02ad72297899e1d019971876e1b1f3fe03d) [#250](https://github.com/preactjs/prefresh/pull/250) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support vite 2.0

## 1.2.3

### Patch Changes

- Updated dependencies [[`21f8c43`](https://github.com/preactjs/prefresh/commit/21f8c4330a29edcb5d4493cda5465e6556a5f92c)]:
  - @prefresh/babel-plugin@0.4.0
  - @prefresh/core@1.3.0

## 1.2.2

### Patch Changes

- Updated dependencies [[`c0835d5`](https://github.com/preactjs/prefresh/commit/c0835d5c5820809563ec768296a610b45d7dc0c0)]:
  - @prefresh/babel-plugin@0.3.0

## 1.2.0

### Minor Changes

- [`bcc90a6`](https://github.com/preactjs/prefresh/commit/bcc90a6da0aa84ddf83255990efb56a2e87021e2) [#218](https://github.com/preactjs/prefresh/pull/218) Thanks [@DreierF](https://github.com/DreierF)! - feature: Added type declarations

## 1.1.4

### Patch Changes

- Updated dependencies [[`39c60c5`](https://github.com/preactjs/prefresh/commit/39c60c5862adef106fed1ca59a968f40cdacdd10)]:
  - @prefresh/babel-plugin@0.2.2

## 1.1.3

### Patch Changes

- Updated dependencies [[`53e79a8`](https://github.com/preactjs/prefresh/commit/53e79a8bcdf5ef3a9387e46307cfd0ce1a2a3186)]:
  - @prefresh/babel-plugin@0.2.1

## 1.1.2

### Patch Changes

- [`cbc79e2`](https://github.com/preactjs/prefresh/commit/cbc79e2c6e11e6965b3fc64f1f880119ce532393) [#188](https://github.com/preactjs/prefresh/pull/188) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove unused code and require @prefresh/babel-plugin

- Updated dependencies [[`b075a8e`](https://github.com/preactjs/prefresh/commit/b075a8ebb7c613b8ce41844d82532803fd61f710), [`25c683c`](https://github.com/preactjs/prefresh/commit/25c683cf47484ee1612ff0fcd677f788b00d8860)]:
  - @prefresh/core@1.0.0
  - @prefresh/utils@1.0.0

## 1.1.1

### Patch Changes

- Updated dependencies [[`430fe2c`](https://github.com/preactjs/prefresh/commit/430fe2c2b281b1973a74c542a38c1bb5be2a6559)]:
  - @prefresh/babel-plugin@0.2.0

## 1.1.0

### Minor Changes

- [`515735b`](https://github.com/preactjs/prefresh/commit/515735bace3d59d240ade7c8f5d0aee2be35e801) [#179](https://github.com/preactjs/prefresh/pull/179) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - use @prefresh/babel-plugin instead of react-refresh/babel to support context HMR

## 1.0.2

### Patch Changes

- [`2943da3`](https://github.com/preactjs/prefresh/commit/2943da358cdf6bad1a64a1a66419f355d9a2b381) [#155](https://github.com/preactjs/prefresh/pull/155) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix custom-hook signing

## 1.0.1

### Patch Changes

- [`b0a28ec`](https://github.com/preactjs/prefresh/commit/b0a28ec762801716745463bb817e74f78a13a4b9) [#152](https://github.com/preactjs/prefresh/pull/152) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix crash by removing unused import

## 1.0.0

### Major Changes

- [`4020961`](https://github.com/preactjs/prefresh/commit/402096167ad77085d207f705703d7102d5d441a4) [#140](https://github.com/preactjs/prefresh/pull/140) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Remove the prefresh-check based on exported components and only rely on register passes.

### Patch Changes

- Updated dependencies [[`9e34c74`](https://github.com/preactjs/prefresh/commit/9e34c7408a5307f270681f2c7029180908a5538a)]:
  - @prefresh/core@0.8.1
  - @prefresh/utils@0.3.1

## 0.11.0

### Minor Changes

- [`32b7a6e`](https://github.com/preactjs/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb) [#131](https://github.com/preactjs/prefresh/pull/131) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Handle non-exported components correctly

### Patch Changes

- Updated dependencies [[`32b7a6e`](https://github.com/preactjs/prefresh/commit/32b7a6e86036efd7363ae599317f3d3770a0a1bb)]:
  - @prefresh/core@0.8.0
  - @prefresh/utils@0.3.0

## 0.10.3

### Patch Changes

- Republish due to failed builds script.

## 0.10.2

### Patch Changes

- [`42ac94f`](https://github.com/preactjs/prefresh/commit/42ac94f2020a906c908333810b2386feeb8e6f3f) [#117](https://github.com/preactjs/prefresh/pull/117) Thanks [@intrnl](https://github.com/intrnl)! - Skip transforming node_modules

## 0.10.1

### Patch Changes

- [`23bdb37`](https://github.com/preactjs/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e) [#115](https://github.com/preactjs/prefresh/pull/115) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add .npmignore removing example

- Updated dependencies [[`23bdb37`](https://github.com/preactjs/prefresh/commit/23bdb376c9d20d986f669599c19a98bf991f290e)]:
  - @prefresh/core@0.7.2
  - @prefresh/utils@0.2.1

## 0.10.0

### Minor Changes

- [`73d1d57`](https://github.com/preactjs/prefresh/commit/73d1d57440e75476584046a34fa8d4d188c9aca5) [#111](https://github.com/preactjs/prefresh/pull/111) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support vite v1-beta

## 0.9.3

### Patch Changes

- [`203bc1c`](https://github.com/preactjs/prefresh/commit/203bc1c916f8c2c0474677bb4dca2e5788a685c8) [#108](https://github.com/preactjs/prefresh/pull/108) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add /dist files correctly to the publish

## 0.9.2

### Patch Changes

- [`1848d91`](https://github.com/preactjs/prefresh/commit/1848d9183aaae7cf1a3da9baeccd27935e7c563d) [#105](https://github.com/preactjs/prefresh/pull/105) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Change `window` to `self` so prefresh works outside of the browser

* [`476c8b8`](https://github.com/preactjs/prefresh/commit/476c8b8ca75fba6e69e046510beb78dfe0e46544) [#107](https://github.com/preactjs/prefresh/pull/107) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Correctly return the function type from the refreshSigning

## 0.9.1

### Patch Changes

- [`778ad18`](https://github.com/preactjs/prefresh/commit/778ad18769976692e4195a92bcb81e9579086533) [#98](https://github.com/preactjs/prefresh/pull/98) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix issue where a default export would not correctly bring in the oldModule

## 0.9.0

### Minor Changes

- [`2cd872b`](https://github.com/preactjs/prefresh/commit/2cd872b1cb03808c3075fcc7240b779432a5f645) [#96](https://github.com/preactjs/prefresh/pull/96) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support vite > 0.17 this version won't be compatible with 0.16 and under.

## 0.8.3

### Patch Changes

- [`5b625bd`](https://github.com/preactjs/prefresh/commit/5b625bd1d5722dcbcf658cc4ddff9b0b55066556) [#90](https://github.com/preactjs/prefresh/pull/90) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Fix import transforming to require

## 0.8.2

### Patch Changes

- [`518d403`](https://github.com/preactjs/prefresh/commit/518d4030a4b2c0e3d53636808633d9f049aa5695) [#76](https://github.com/preactjs/prefresh/pull/76) Thanks [@lukeed](https://github.com/lukeed)! - Allow @prefresh/vite to work within pnpm and yarn@2.x projects

## 0.8.1

### Patch Changes

- Updated dependencies [[`501d8f6`](https://github.com/preactjs/prefresh/commit/501d8f6e62db87099846b80fc4d22185c2e3dad2)]:
  - @prefresh/core@0.7.1

## 0.8.0

### Minor Changes

- [`520acd7`](https://github.com/preactjs/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90) [#69](https://github.com/preactjs/prefresh/pull/69) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add export maps for Node 13/14

### Patch Changes

- Updated dependencies [[`9948be5`](https://github.com/preactjs/prefresh/commit/9948be52120d03992a183f24e9f4ef53a9a27629), [`520acd7`](https://github.com/preactjs/prefresh/commit/520acd75ea2a1414ccf8a614049f7b159f448a90)]:
  - @prefresh/core@0.7.0
  - @prefresh/utils@0.2.0

## 0.7.0

### Minor Changes

- [`c224080`](https://github.com/preactjs/prefresh/commit/c2240803a1631061085046da42c64fdcca78e3b8) [#62](https://github.com/preactjs/prefresh/pull/62) Thanks [@yyx990803](https://github.com/yyx990803)! - upgrade for vite 0.17 compatibility

### Patch Changes

- Updated dependencies [[`ee56105`](https://github.com/preactjs/prefresh/commit/ee5610575228663c08d40eed17a46064089d0075)]:
  - @prefresh/core@0.6.2

## 0.6.1

### Patch Changes

- [`846eec0`](https://github.com/preactjs/prefresh/commit/846eec0a77ba8f9b8e1ea36bfc0dd6a6ad7ba94c) [#44](https://github.com/preactjs/prefresh/pull/44) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add esm + CJS exports

- Updated dependencies [[`846eec0`](https://github.com/preactjs/prefresh/commit/846eec0a77ba8f9b8e1ea36bfc0dd6a6ad7ba94c)]:
  - @prefresh/utils@0.1.2

## 0.6.0

### Minor Changes

- [`9b38392`](https://github.com/preactjs/prefresh/commit/9b3839201160156c74094a702a2853eef7152b92) [#42](https://github.com/preactjs/prefresh/pull/42) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Support hook reloading by comparing signatures.

## 0.5.2

### Patch Changes

- [`4e3d82b`](https://github.com/preactjs/prefresh/commit/4e3d82b747f1035486d20bd7b6c7d084801bad0f) [#37](https://github.com/preactjs/prefresh/pull/37) Thanks [@JoviDeCroock](https://github.com/JoviDeCroock)! - Add fallback when module-replacement fails.
