import prefresh from '@prefresh/vite';

module.exports = {
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  plugins: [prefresh()],
};
