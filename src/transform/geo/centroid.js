const assign = require('lodash/assign');
const each = require('lodash/each');
const isString = require('lodash/isString');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  // field: 'name', // required
  // geoDataView: dataView, // required
  as: '_centroid'
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
  if (!as || !isString(as)) {
    throw new TypeError('Invalid as');
  }
  each(dataView.rows, row => {
    const feature = geoDataView.geoFeatureByName(row[field]);
    if (feature) {
      row[as] = feature.centroid;
    }
  });
}

registerTransform('geo.centroid', transform);
