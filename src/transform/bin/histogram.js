const assign = require('lodash/assign');
const each = require('lodash/each');
const forIn = require('lodash/forIn');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'count' ],
  bins: 20
  // field: '', // required
  // binWidth: 10, // override bins
};

function nearestBinsCenters(value, scale) {
  const div = Math.floor(value / scale);
  const rounded = scale * (div + (div % 2 === 1 ? 1 : 0));
  const roundedScaled = scale * (div + (div % 2 === 1 ? 0 : 1));
  return [ rounded, roundedScaled ];
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
    const [ rounded, roundedScaled ] = nearestBinsCenters(value, binWidth);
    let binKey;
    const d1 = Math.abs(value - rounded);
    const d2 = Math.abs(value - roundedScaled);
    if (d1 < d2) {
      binKey = rounded;
    } else {
      binKey = roundedScaled;
    }
    bins[binKey] = bins[binKey] || {
      x0: binKey - binWidth / 2,
      x1: binKey + binWidth / 2,
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
