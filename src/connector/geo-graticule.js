const map = require('lodash/map');
const {
  geoGraticule
} = require('d3-geo');
const {
  registerConnector
} = require('../data-set');

function connector(options, dataView) {
  dataView.dataType = 'geo-graticule';
  const data = geoGraticule().lines();

  map(data, (row, index) => {
    row.index = `${index}`;
  });

  dataView.rows = data;
  return data;
}

registerConnector('geo-graticule', connector);

module.exports = connector;
