const assign = require('lodash/assign');
const each = require('lodash/each');
const isArray = require('lodash/isArray');
const isString = require('lodash/isString');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  // field: 'name', // required
  // geoDataView: dataView, // required
  as: [ '_centroid_x', '_centroid_y' ]
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  if (!field) {
    throw new TypeError('Invalid field');
  }
  let geoDataView = options.geoDataView;
  if (isString(geoDataView)) {
    geoDataView = dataView.dataSet.getView(geoDataView);
  }
  if (!geoDataView || geoDataView.dataType !== 'geo') {
    throw new TypeError('Invalid geoDataView');
  }
  const as = options.as;
  if (!as || !isArray(as)) {
    throw new TypeError('Invalid as');
  }
  const centroidX = as[0];
  const centroidY = as[1];
  each(dataView.rows, row => {
    const feature = geoDataView.geoFeatureByName(row[field]);
    if (feature) {
      if (geoDataView._projectedAs) {
        row[centroidX] = feature[geoDataView._projectedAs[2]];
        row[centroidY] = feature[geoDataView._projectedAs[3]];
      } else {
        row[centroidX] = feature.centroidX;
        row[centroidY] = feature.centroidY;
      }
    }
  });
}

registerTransform('geo.centroid', transform);
