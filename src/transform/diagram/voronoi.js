const assign = require('lodash/assign');
const d3Voronoi = require('d3-voronoi');
const each = require('lodash/each');
const filter = require('lodash/filter');
const map = require('lodash/map');
const isArray = require('lodash/isArray');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  // x: 'x', // field x, required
  // y: 'y', // field y, required
  // extend: [[x0, y0], [x1, y1]], // optional
  // size: [width, height], // optional
  as: [ '_x', '_y' ]
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid option: as');
  }
  const xField = as[0];
  const yField = as[1];

  const x = options.x;
  const y = options.y;
  if (!x || !y) {
    throw new TypeError('Invalid options');
  }

  const rows = dataView.rows;
  const data = map(rows, row => [ row[x], row[y] ]);
  const voronoi = d3Voronoi.voronoi();
  if (options.extend) {
    voronoi.extent(options.extend);
  }
  if (options.size) {
    voronoi.size(options.size);
  }
  const polygons = voronoi(data).polygons();
  each(rows, (row, i) => {
    const polygon = filter(polygons[i], point => !!point); // some points are null
    row[xField] = map(polygon, point => point[0]);
    row[yField] = map(polygon, point => point[1]);
  });
}

registerTransform('diagram.voronoi', transform);
registerTransform('voronoi', transform);
