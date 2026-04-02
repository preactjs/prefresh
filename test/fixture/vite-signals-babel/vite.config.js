import prefresh from '@prefresh/vite';

export default {
  server: {
    port: 3008
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
