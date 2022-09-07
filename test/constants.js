const path = require('path');

exports.integrations = [
  'vite',
  'snowpack',
  'nollup',
  'webpack',
  'web-dev-server',
  'next',
];

exports.bin = {
  next: dir => path.resolve(dir, `./node_modules/next/dist/bin/next`),
  nollup: dir => path.resolve(dir, `./node_modules/nollup/lib/cli.js`),
  snowpack: dir => path.resolve(dir, `./node_modules/snowpack/index.bin.js`),
  vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-preact-compat': dir =>
    path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'vite-signals': dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'web-dev-server': dir =>
    path.resolve(dir, `./node_modules/@web/dev-server/dist/bin.js`),
  webpack: dir => path.resolve(dir, `./node_modules/webpack-cli/bin/cli.js`),
};

exports.binArgs = {
  next: ['dev', '-p', '3006'],
  snowpack: ['dev'],
  webpack: ['serve'],
  'vite-preact-compat': [],
  'vite-signals': [],
  vite: [],
  nollup: ['-c', '--hot', '--content-base', 'public', '--port', '3003'],
  'web-dev-server': [],
};

exports.goMessage = {
  vite: 'running',
  'vite-preact-compat': 'running',
  'vite-signals': 'running',
  snowpack: 'Server started',
  webpack: 'successfully',
  nollup: 'Compiled',
  next: 'successfully',
  'web-dev-server': 'started',
};

exports.defaultPort = {
  vite: 3000,
  'vite-preact-compat': 3002,
  webpack: 3001,
  nollup: 3003,
  snowpack: 3004,
  'web-dev-server': 3005,
  next: 3006,
  'vite-preact-compat': 3007,
};
