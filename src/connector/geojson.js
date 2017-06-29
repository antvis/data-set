const {
  registerConnector
} = require('../data-set');

function GeoJSONConnector(data, options, dataView) {
  dataView.dataType = 'geo';
  const features = data.features;
  return features;
}

registerConnector('geo', GeoJSONConnector);
registerConnector('geojson', GeoJSONConnector);
registerConnector('GeoJSON', GeoJSONConnector);

module.exports = GeoJSONConnector;
