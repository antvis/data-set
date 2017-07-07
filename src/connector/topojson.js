const {
  feature
} = require('topojson-client');
const GeoJSONConnector = require('./geojson');
const {
  registerConnector
} = require('../data-set');

function TopoJSONConnector(data, options, dataView) {
  const object = options.object;
  if (!object) {
    throw new TypeError('Invalid options');
  }
  const geoData = feature(data, data.objects[object]);
  return GeoJSONConnector(geoData, options, dataView);
}

registerConnector('topojson', TopoJSONConnector);
registerConnector('TopoJSON', TopoJSONConnector);
