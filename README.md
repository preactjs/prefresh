# Prefresh

**Experimental package**

- [core](https://github.com/JoviDeCroock/prefresh/tree/master/packages/core)
- [next](https://github.com/JoviDeCroock/prefresh/tree/master/packages/next)
- [nollup](https://github.com/JoviDeCroock/prefresh/tree/master/packages/nollup)
- [snowpack](https://github.com/JoviDeCroock/prefresh/tree/master/packages/snowpack)
- [utils](https://github.com/JoviDeCroock/prefresh/tree/master/packages/utils)
- [vite](https://github.com/JoviDeCroock/prefresh/tree/master/packages/vite)
- [webpack](https://github.com/JoviDeCroock/prefresh/tree/master/packages/webpack)

## Best practices

The general best practices are linear to other hot-reloaders and concepts.
Aim at making your components recognizable, so start them with a capital, if you're
using custom-hooks start them with "use" and then a capital letter.
If you're sharing hooks between components don't export them from the same place
you're exporting components from. This could lead to stale occurences in other components.

Example:

/
 - Counter.js --> The Counter component
 - BigCounter.js --> The BigCounter component
 - sharedHooks.js --> useCounter

Note that a component like this

```jsx
export default () => {
  return <p>Want to refresh</p>
}
```

won't be seen as a component because there is no way for prefresh to derive the name
of this component. This can be solved by doing:

```jsx
const Refresh = () => {
  return <p>Want to refresh</p>
}

export default Refresh;
```

When you are working with HOC's be sure to lift up the `displayName` so we can
recognise it as a component.
