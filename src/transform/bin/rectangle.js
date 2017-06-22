const assign = require('lodash/assign');
const each = require('lodash/each');
const isArray = require('lodash/isArray');
const {
  histogram
} = require('d3-array');
const DataSet = require('../../data-set');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'y' ]
  // fields: ['field0', 'field1'], // required
  // domainX: [minX, maxX],
  // domainY: [minY, maxY],
  // thresholdsX: [],
  // thresholdsY: [],
  // TODO step?
};

function processField(dataView, options, isX) {
  const histogramGenerator = histogram();
  const field = options.field;
  const domain = options.domain;
  const thresholds = options.thresholds;
  const as = options.as;
  const rows = dataView.rows;
  const column = dataView.getColumn(field);
  if (domain) {
    histogramGenerator.domain(domain);
  }
  if (thresholds) {
    histogramGenerator.thresholds(thresholds);
  }
  const binByValue = {};
  each(histogramGenerator(column), bin => {
    each(bin, value => {
      const currentBin = binByValue[value] = {};
      /*
       * points:
       *   3 - 2
       *   |   |
       *   0 - 1
       */
      if (isX) {
        currentBin[as] = [ bin.x0, bin.x1, bin.x1, bin.x0 ];
      } else {
        currentBin[as] = [ bin.x0, bin.x0, bin.x1, bin.x1 ];
      }
    });
  });
  each(rows, row => {
    const bin = binByValue[row[field]];
    assign(row, bin);
  });
}

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = options.fields;
  if (!isArray(fields) && fields.length !== 2) {
    throw new TypeError('Invalid option: fields');
  }
  processField(dataView, {
    field: fields[0],
    domain: options.domainX,
    thresholds: options.thresholdsX,
    as: options.as[0]
  }, true);
  processField(dataView, {
    field: fields[1],
    domain: options.domainY,
    thresholds: options.thresholdsY,
    as: options.as[1]
  });
}

DataSet.registerTransform('bin.rectangle', transform);
// alias
DataSet.registerTransform('bin.rect', transform);
