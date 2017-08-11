const each = require('lodash/each');
const getPointAtLength = require('point-at-length');
const {
  geoPath
} = require('d3-geo');
const cloneItems = require('../util/clone-items');
const {
  registerConnector
} = require('../data-set');

const geoPathGenerator = geoPath();

function GeoJSONConnector(data, options, dataView) {
  dataView.dataType = 'geo';
  const features = cloneItems(data.features);

  // pre-process
  each(features, feature => {
    feature.name = feature.properties.name;
    feature.longitude = [];
    feature.latitude = [];
    const pathData = feature.pathData = geoPathGenerator(feature);
    const points = getPointAtLength(pathData);
    each(points._path, point => {
      feature.longitude.push(point[1]);
      feature.latitude.push(point[2]);
    });
    const centroid = geoPathGenerator.centroid(feature);
    feature.centroidX = centroid[0];
    feature.centroidY = centroid[1];
  });

  dataView.rows = features;
  return data.features;
}

registerConnector('geo', GeoJSONConnector);
registerConnector('geojson', GeoJSONConnector);
registerConnector('GeoJSON', GeoJSONConnector);

module.exports = GeoJSONConnector;
