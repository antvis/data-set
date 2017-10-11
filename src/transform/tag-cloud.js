const assign = require('lodash/assign');
const pick = require('lodash/pick');
const {
  registerTransform
} = require('../data-set');
const tagCloud = require('../util/tag-cloud');

const DEFAULT_OPTIONS = {
  fields: [ 'text', 'value' ], // fields to keep
  font: 'serif',
  padding: 1,
  size: [ 500, 500 ],
  spiral: 'archimedean', // 'archimedean' || 'rectangular' || {function}
  fontSize(d) {
    return d.value;
  },
  text(d) {
    return d.text;
  },
  timeInterval: Infinity // max execute time
  // imageMask: '', // instance of Image, must be loaded
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const layout = tagCloud();
  [
    'font',
    'fontSize',
    'padding',
    'size',
    'spiral',
    'text',
    'timeInterval'
  ].forEach(key => {
    layout[key](options[key]);
  });
  const words = dataView.rows.map(row => pick(row, options.fields));
  layout.words(words);
  if (options.imageMask) {
    layout.createMask(options.imageMask);
  }
  const { tags } = layout.execute();
  dataView.rows = tags;
}

registerTransform('tag-cloud', transform);
registerTransform('word-cloud', transform);
