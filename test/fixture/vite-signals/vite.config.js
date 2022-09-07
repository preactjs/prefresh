import prefresh from '@prefresh/vite';

export default {
  server: {
    port: 3007
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  optimizeDeps: {
    include: ['preact/hooks']
  },
	plugins: [prefresh()]
};
