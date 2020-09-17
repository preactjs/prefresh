# Prefresh-snowpack

[![npm version](https://badgen.net/npm/v/@prefresh/snowpack)](https://www.npmjs.com/package/@prefresh/snowpack)

## Setup

If you're using the [`preact-template`](https://github.com/pikapkg/create-snowpack-app/tree/master/packages/app-scripts-preact) you'll get this behavior
out of the box, if you don't or are using the old version fo it you'll have to follow these instructions.

```
npm i -s @prefresh/snowpack
## OR
yarn add @prefresh/snowpack
```

You'll have to add a few things, as seen in [this PR](https://github.com/pikapkg/create-snowpack-app/pull/54/files).

Add `@prefresh/babel-plugin` to your `babel.config.json`:

```json
{
  "presets": [["@babel/preset-react", {
    "pragma": "h",
    "pragmaFrag": "Fragment"
  }], "@babel/preset-typescript"],
  "plugins": ["@babel/plugin-syntax-import-meta", "@prefresh/babel-plugin"]
}
```

After adding it to your `babel-config` you'll have to make sure your `snowpack.config.json` contains both `plugin-babel` and `@prefresh/snowpack`

```json
{
  "plugins": [
    "@snowpack/plugin-babel",
    "@prefresh/snowpack"
  ]
}
```

## Best practices

### Recognition

We need to be able to recognise your components, this means that components should
start with a capital letter and hook should start with `use` followed by a capital letter.
This allows the Babel plugin to effectively recognise these.

Do note that a component as seen below is not named.

```jsx
export default () => {
  return <p>Want to refresh</p>
}
```

Instead do:

```jsx
const Refresh = () => {
  return <p>Want to refresh</p>
}

export default Refresh;
```

When you are working with HOC's be sure to lift up the `displayName` so we can
recognise it as a component.

### Context

We don't have a mechanism in place to hot reload context, that's why our general advice is to move
these to their own files.
