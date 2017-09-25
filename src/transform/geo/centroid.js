const assign = require('lodash/assign');
const each = require('lodash/each');
const isArray = require('lodash/isArray');
const isString = require('lodash/isString');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  // field: 'name', // required
  // geoView: view, // required
  // geoDataView: view, // alias
  as: [ '_centroid_x', '_centroid_y' ]
};

function transform(view, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = options.field;
  if (!field) {
    throw new TypeError('Invalid field');
  }
  let geoView = options.geoView || options.geoDataView; // alias
  if (isString(geoView)) {
    geoView = view.dataSet.getView(geoView);
  }
  if (!geoView || geoView.dataType !== 'geo') {
    throw new TypeError('Invalid geoView');
  }
  const as = options.as;
  if (!as || !isArray(as)) {
    throw new TypeError('Invalid as');
  }
  const centroidX = as[0];
  const centroidY = as[1];
  each(view.rows, row => {
    const feature = geoView.geoFeatureByName(row[field]);
    if (feature) {
      if (geoView._projectedAs) {
        row[centroidX] = feature[geoView._projectedAs[2]];
        row[centroidY] = feature[geoView._projectedAs[3]];
      } else {
        row[centroidX] = feature.centroidX;
        row[centroidY] = feature.centroidY;
      }
    }
  });
}

registerTransform('geo.centroid', transform);
