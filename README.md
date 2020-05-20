# Prefresh

**Experimental package**

- [core](https://github.com/JoviDeCroock/prefresh/tree/master/packages/core)
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
