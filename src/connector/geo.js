const {
  registerConnector
} = require('../data-set');

function GeoJSONConnector(data) {
  return data.features;
}

registerConnector('geo', GeoJSONConnector);
registerConnector('geojson', GeoJSONConnector);
registerConnector('GeoJSON', GeoJSONConnector);
