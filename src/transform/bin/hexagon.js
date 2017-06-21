const assign = require('lodash/assign');
const isArray = require('lodash/isArray');
const map = require('lodash/map');
const each = require('lodash/each');
const forIn = require('lodash/forIn');
const {
  hexbin
} = require('d3-hexbin');
const DataSet = require('../../data-set');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'y' ]
  // fields: ['field0', 'field1'], // required
  // radius: radius,
  // extent: [[minX, maxX], [minY, maxY]],
};

const thirdPi = Math.PI / 3;
const angles = [ 0, thirdPi, 2 * thirdPi, 3 * thirdPi, 4 * thirdPi, 5 * thirdPi ];

function getHexagonPoints(radius) {
  /*
   * points:
   *        3
   *   4          2
   *
   *   5          1
   *        0
   */
  return angles.map(angle => {
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;
    return {
      x,
      y
    };
  });
}

function getHexagonPointsXY(points, center, as) {
  const result = {};
  const xKey = as[0];
  const yKey = as[1];
  result[xKey] = [];
  result[yKey] = [];
  each(points, point => {
    result[xKey].push(point.x - center.x);
    result[yKey].push(point.y - center.y);
  });
  return result;
}

function transform(dataView, options) {
  const hexbinGenerator = hexbin();
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = options.fields;
  const radius = options.radius;
  const extent = options.extent;
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('Invalid option: fields');
  }
  const field0 = fields[0];
  const field1 = fields[1];
  const points = map(dataView.rows, row => [ row[field0], row[field1] ]);
  if (radius) {
    hexbinGenerator.radius(radius);
  }
  if (extent) {
    hexbinGenerator.extent(extent);
  }
  const centerByPoint = {};
  each(hexbinGenerator(points), bin => {
    each(bin, point => {
      const key = `${point[0]}-${point[1]}`;
      centerByPoint[key] = {
        x: bin.x,
        y: bin.y
      };
    });
  });
  const hexagonPoints = getHexagonPoints(hexbinGenerator.radius());
  const hexagonsByCenter = {}; // caching
  forIn(centerByPoint, center => {
    const key = `${center.x}-${center.y}`;
    if (!hexagonsByCenter[key]) {
      hexagonsByCenter[key] = getHexagonPointsXY(hexagonPoints, center, options.as);
    }
  });
  each(dataView.rows, row => {
    const pointKey = `${row[field0]}-${row[field1]}`;
    const center = centerByPoint[pointKey];
    const hexagonCenterKey = `${center.x}-${center.y}`;
    assign(row, hexagonsByCenter[hexagonCenterKey]);
  });
}

DataSet.registerTransform('bin.hexagon', transform);
DataSet.registerTransform('bin.hex', transform);
