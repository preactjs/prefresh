const path = require('path');

exports.integrations = [
  'vite',
  'snowpack',
  'nollup',
  'next',
  'webpack',
  'web-dev-server',
  'next-webpack5',
];

exports.bin = {
  'next-webpack5': dir =>
    path.resolve(dir, `./node_modules/next/dist/bin/next`),
  next: dir => path.resolve(dir, `./node_modules/next/dist/bin/next`),
  nollup: dir => path.resolve(dir, `./node_modules/nollup/lib/cli.js`),
  snowpack: dir => path.resolve(dir, `./node_modules/snowpack/index.bin.js`),
  vite: dir => path.resolve(dir, `./node_modules/vite/bin/vite.js`),
  'web-dev-server': dir =>
    path.resolve(dir, `./node_modules/@web/dev-server/dist/bin.js`),
  webpack: dir => path.resolve(dir, `./node_modules/webpack-cli/bin/cli.js`),
};

exports.binArgs = {
  'next-webpack5': ['dev', '-p', '3006'],
  next: ['dev', '-p', '3002'],
  snowpack: ['dev'],
  webpack: ['serve'],
  vite: [],
  nollup: ['-c', '--hot', '--content-base', 'public', '--port', '3003'],
  'web-dev-server': [],
};

exports.goMessage = {
  vite: 'running',
  snowpack: 'Server started',
  webpack: 'successfully',
  nollup: 'Compiled',
  next: 'successfully',
  'next-webpack5': 'successfully',
  'web-dev-server': 'started',
};

exports.defaultPort = {
  vite: 3000,
  webpack: 3001,
  next: 3002,
  nollup: 3003,
  snowpack: 3004,
  'web-dev-server': 3005,
  'next-webpack5': 3006,
};
