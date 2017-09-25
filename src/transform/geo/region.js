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
  as: [ '_x', '_y' ]
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
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as');
  }
  const lonField = as[0];
  const latField = as[1];
  each(view.rows, row => {
    const feature = geoView.geoFeatureByName(row[field]);
    if (feature) {
      if (geoView._projectedAs) {
        row[lonField] = feature[geoView._projectedAs[0]];
        row[latField] = feature[geoView._projectedAs[1]];
      } else {
        row[lonField] = feature.longitude;
        row[latField] = feature.latitude;
      }
    }
  });
}

registerTransform('geo.region', transform);
