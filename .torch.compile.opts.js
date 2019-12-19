module.exports = {
  babelrc: {
    presets: ['@babel/env'],
    sourceMaps: 'inline',
  },
  extensions: ['.es6', '.es', '.jsx', '.js', '.ts'],
  include: ['src/**', 'test/**'],
  exclude: ['node_modules/**'],
  tsconfig: require('./tsconfig.json'),
};
