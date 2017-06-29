const assign = require('lodash/assign');
const d3Geo = require('d3-geo');
const d3GeoProjection = require('d3-geo-projection');
const each = require('lodash/each');
const isArray = require('lodash/isArray');
const isFunction = require('lodash/isFunction');
const isString = require('lodash/isString');
const getPointAtLength = require('point-at-length');
const {
  registerTransform
} = require('../../data-set');

const {
  geoPath
} = d3Geo;

const DEFAULT_OPTIONS = {
  // projection: '', // default to null
  as: [ 'name', 'latitude', 'longitude', 'centroid' ]
};

function getProjection(projection) {
  if (isFunction(projection)) {
    return projection();
  }
  if (isString(projection)) {
    if (d3Geo[projection]) {
      return d3Geo[projection]();
    }
    if (d3GeoProjection[projection]) {
      return d3GeoProjection[projection]();
    }
  }
  return null;
}

function transform(dataView, options) {
  if (dataView.dataType !== 'geo') {
    throw new TypeError('This transform is for Geo data only');
  }
  options = assign({}, DEFAULT_OPTIONS, options);
  const projection = getProjection(options.projection);
  const geoPathGenerator = geoPath(projection);
  const as = options.as;
  if (!isArray(as) || as.length !== 4) {
    throw new TypeError('Invalid option: as');
  }
  const nameField = as[0];
  const lonField = as[1];
  const latField = as[2];
  const centroid = as[3];
  each(dataView.rows, row => {
    row[nameField] = row.properties.name;
    row[lonField] = [];
    row[latField] = [];
    const pathData = row.pathData = geoPathGenerator(row);
    const points = getPointAtLength(pathData);
    each(points._path, point => {
      row[lonField].push(point[1]);
      row[latField].push(point[2]);
    });
    row[centroid] = geoPathGenerator.centroid(row);
  });
}

registerTransform('geo.projection', transform);
