const path = require('path');

exports.integrations = ['vite', 'vite-babel'];

exports.bin = {
  vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-babel': dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-preact-compat': dir =>
    path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-preact-compat-babel': dir =>
    path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-signals': dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-signals-babel': dir =>
    path.resolve(dir, `./node_modules/vite/bin/vite.js`),
};

exports.binArgs = {
  'vite-preact-compat': [],
  'vite-preact-compat-babel': [],
  'vite-signals': [],
  'vite-signals-babel': [],
  vite: [],
  'vite-babel': [],
};

exports.goMessage = {
  vite: 'ready',
  'vite-babel': 'ready',
  'vite-preact-compat': 'ready',
  'vite-preact-compat-babel': 'ready',
  'vite-signals': 'ready',
  'vite-signals-babel': 'ready',
};

exports.defaultPort = {
  vite: 3000,
  'vite-babel': 3001,
  'vite-preact-compat': 3002,
  'vite-preact-compat-babel': 3003,
  'vite-signals': 3007,
  'vite-signals-babel': 3008,
};
