const isFunction = require('lodash/isFunction');
const isString = require('lodash/isString');
const d3Geo = require('d3-geo');
const d3GeoProjection = require('d3-geo-projection');

module.exports = projection => {
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
};
