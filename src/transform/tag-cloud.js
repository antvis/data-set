const assign = require('lodash/assign');
const isString = require('lodash/isString');
const {
  registerTransform
} = require('../data-set');
const tagCloud = require('../util/tag-cloud');
const {
  getFields
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  fields: [ 'text', 'value' ], // fields to keep
  font: 'serif',
  padding: 1,
  size: [ 500, 500 ],
  spiral: 'archimedean', // 'archimedean' || 'rectangular' || {function}
  timeInterval: Infinity // max execute time
  // imageMask: '', // instance of Image, must be loaded
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const layout = tagCloud();
  [
    'font',
    'padding',
    'size',
    'spiral',
    'timeInterval'
  ].forEach(key => {
    layout[key](options[key]);
  });
  const fields = getFields(options);
  const [ text, value ] = fields;
  if (!isString(text) || !isString(value)) {
    throw new TypeError('Invalid fields: must be an array with 2 strings (e.g. [ "text", "value" ])!');
  }
  const words = dataView.rows.map(row => {
    const word = {};
    word.text = row[text];
    word.value = row[value];
    return word;
  });
  layout.words(words);
  if (options.imageMask) {
    layout.createMask(options.imageMask);
  }
  const { tags } = layout.execute();
  dataView.rows = tags;
}

registerTransform('tag-cloud', transform);
registerTransform('word-cloud', transform);
