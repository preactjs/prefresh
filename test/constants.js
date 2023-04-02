const path = require('path');

exports.integrations = ['vite'];

exports.bin = {
  vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-preact-compat': dir =>
    path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-signals': dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
};

exports.binArgs = {
  'vite-preact-compat': [],
  'vite-signals': [],
  vite: [],
};

exports.goMessage = {
  vite: 'running',
  'vite-preact-compat': 'running',
  'vite-signals': 'running',
};

exports.defaultPort = {
  vite: 3000,
  'vite-preact-compat': 3002,
  'vite-signals': 3007,
};
