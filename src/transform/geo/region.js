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
  as: [ '_x', '_y' ]
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
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as');
  }
  const lonField = as[0];
  const latField = as[1];
  each(dataView.rows, row => {
    const feature = geoDataView.geoFeatureByName(row[field]);
    if (feature) {
      if (geoDataView._projectedAs) {
        row[lonField] = feature[geoDataView._projectedAs[0]];
        row[latField] = feature[geoDataView._projectedAs[1]];
      } else {
        row[lonField] = feature.longitude;
        row[latField] = feature.latitude;
      }
    }
  });
}

registerTransform('geo.region', transform);
