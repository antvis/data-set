const assign = require('lodash/assign');
const each = require('lodash/each');
const forIn = require('lodash/forIn');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'count' ],
  bins: 30
  // field: '', // required
  // binWidth: 10, // override bins
};

function nearestBin(value, scale) {
  const div = Math.floor(value / scale);
  return [ div * scale, (div + 1) * scale ];
}

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  if (!field) {
    throw new TypeError('Invalid option: field');
  }
  const column = dataView.getColumn(field);
  const range = dataView.range(field);
  const width = range[1] - range[0];
  let binWidth = options.binWidth;
  if (!binWidth) {
    const bins = options.bins;
    if (bins <= 0) {
      throw new TypeError('Invalid option: bins');
    }
    binWidth = width / bins;
  }
  const bins = {};
  each(column, value => {
    const [ x0, x1 ] = nearestBin(value, binWidth);
    const binKey = `${x0}-${x1}`;
    bins[binKey] = bins[binKey] || {
      x0,
      x1,
      count: 0
    };
    bins[binKey].count ++;
  });
  const rows = [];
  const [ xField, countField ] = options.as;
  forIn(bins, bin => {
    const row = {};
    row[xField] = [ bin.x0, bin.x1 ];
    row[countField] = bin.count;
    rows.push(row);
  });
  dataView.rows = rows;
}

registerTransform('bin.histogram', transform);
registerTransform('bin.dot', transform);
