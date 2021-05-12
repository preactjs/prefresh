module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    '@prefresh/babel-plugin',
    ['@babel/plugin-transform-react-jsx', {
      pragma: 'h',
      pragmaFrag: 'Fragment',
    }],
  ],
};
