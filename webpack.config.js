const webpack = require('webpack');
const resolve = require('path').resolve;

module.exports = {
  entry: {
    'data-set': './index.js'
  },
  output: {
    filename: '[name].js',
    library: 'DataSet',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              'transform-remove-strict-mode'
            ],
            presets: [
              [
                'es2015', {
                  loose: true
                  // modules: false
                }
              ],
              'stage-0'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
