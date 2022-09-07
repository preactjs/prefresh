import prefresh from '@prefresh/vite';

export default {
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  optimizeDeps: {
    include: ['preact/hooks']
  },
	plugins: [prefresh()]
};
