const cloneDeep = require('lodash/cloneDeep');
const each = require('lodash/each');
const getPointAtLength = require('point-at-length');
const {
  geoPath
} = require('d3-geo');
const {
  registerConnector
} = require('../data-set');

const geoPathGenerator = geoPath();

function GeoJSONConnector(data, options, dataView) {
  dataView.dataType = 'geo';
  const features = cloneDeep(data.features);

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
    feature.centroid = geoPathGenerator.centroid(feature);
  });

  dataView.rows = features;
  // console.log(features)
  return data.features;
}

registerConnector('geo', GeoJSONConnector);
registerConnector('geojson', GeoJSONConnector);
registerConnector('GeoJSON', GeoJSONConnector);

module.exports = GeoJSONConnector;
