// extra APIs
require('./src/api/geo.js');
require('./src/api/hierarchy.js');
require('./src/api/statistics.js');

// connectors
require('./src/connector/default');
require('./src/connector/dsv');
require('./src/connector/geo-graticule');
require('./src/connector/geojson');
require('./src/connector/hierarchy');
require('./src/connector/topojson');

// transforms
// static
require('./src/transform/default');
require('./src/transform/filter');
require('./src/transform/fold');
require('./src/transform/map');
require('./src/transform/percent');
require('./src/transform/pick');
require('./src/transform/proportion');
require('./src/transform/reverse');
require('./src/transform/sort');
require('./src/transform/sort-by');
require('./src/transform/subset');
// imputation
require('./src/transform/fill-rows');
require('./src/transform/impute');
// statistics
require('./src/transform/aggregate');
// binning
require('./src/transform/bin/hexagon');
require('./src/transform/bin/histogram');
require('./src/transform/bin/quantile');
require('./src/transform/bin/rectangle');
// geo
require('./src/transform/geo/centroid');
require('./src/transform/geo/projection');
require('./src/transform/geo/region');
// diagram
require('./src/transform/diagram/voronoi');
// hierarchy
require('./src/transform/hierarchy/treemap');
// tag cloud
require('./src/transform/tag-cloud');

module.exports = require('./src/data-set');
