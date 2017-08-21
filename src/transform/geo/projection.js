const assign = require('lodash/assign');
const d3Geo = require('d3-geo');
const each = require('lodash/each');
const isArray = require('lodash/isArray');
const filter = require('lodash/filter');
const getPointAtLength = require('point-at-length');
const {
  registerTransform
} = require('../../data-set');
const getGeoProjection = require('../../util/get-geo-projection');

const {
  geoPath
} = d3Geo;
const DEFAULT_OPTIONS = {
  // projection: '', // default to null
  as: [ '_x', '_y', '_centroid_x', '_centroid_y' ]
};

function transform(dataView, options) {
  if (dataView.dataType !== 'geo' && dataView.dataType !== 'geo-graticule') {
    throw new TypeError('This transform is for Geo data only');
  }
  options = assign({}, DEFAULT_OPTIONS, options);
  let projection = options.projection;
  if (!projection) {
    throw new TypeError('Invalid projection');
  }
  projection = getGeoProjection(projection);
  const geoPathGenerator = geoPath(projection);
  const as = options.as;
  if (!isArray(as) || as.length !== 4) {
    throw new TypeError('Invalid option: as');
  }
  dataView._projectedAs = as;
  const [ lonField, latField, centroidX, centroidY ] = as;
  each(dataView.rows, row => {
    row[lonField] = [];
    row[latField] = [];
    const pathData = geoPathGenerator(row);
    if (pathData) {
      // TODO projection returns null
      const points = getPointAtLength(pathData);
      each(points._path, point => {
        row[lonField].push(point[1]);
        row[latField].push(point[2]);
      });
      const centroid = geoPathGenerator.centroid(row);
      row[centroidX] = centroid[0];
      row[centroidY] = centroid[1];
    }
  });
  dataView.rows = filter(dataView.rows, row => row[lonField].length !== 0);
}

registerTransform('geo.projection', transform);
