import prefresh from '@prefresh/vite';

export default {
  server: {
    port: 3002,
  },
  oxc: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  optimizeDeps: {
    include: ['preact/hooks', 'preact/compat', 'preact']
  },
	plugins: [prefresh()]
};
