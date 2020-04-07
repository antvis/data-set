const resolve = require('path').resolve;
const pkg = require('./package.json');

module.exports = {
  devtool: 'cheap-source-map',
  mode: 'development',
  entry: {
    'data-set': './src/index.ts',
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    mainFields: ['browser', 'main', 'module'],
  },
  output: {
    filename: '[name].js',
    library: 'DataSet',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'build/'),
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        include: [
          resolve(__dirname, 'src'),
          function(path) {
            return /d3-.*/.test(path);
          },
        ],
        loader: 'awesome-typescript-loader',
      },
      {
        test: /data\-set\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: '____DATASET_VERSION____',
          replace: pkg.version,
        },
      },
    ],
  },
};
