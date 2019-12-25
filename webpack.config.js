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
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
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
