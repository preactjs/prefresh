# Prefresh-next

[![npm version](https://badgen.net/npm/v/@prefresh/next)](https://www.npmjs.com/package/@prefresh/next)

## Setup

```
npm i -s @prefresh/next
## OR
yarn add @prefresh/next
```

Then add it to your `next` config by doing

```js
const withPrefresh = require('@prefresh/next');
module.exports = withPrefresh()
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
  return <p>Want to refresh</p>;
};
```

Instead do:

```jsx
const Refresh = () => {
  return <p>Want to refresh</p>;
};

export default Refresh;
```

When you are working with HOC's be sure to lift up the `displayName` so we can
recognise it as a component.
