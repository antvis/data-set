// extra APIs
require('./src/api/geo');
require('./src/api/hierarchy');
require('./src/api/partition');
require('./src/api/statistics');

// connectors
require('./src/connector/default');
require('./src/connector/dsv');
require('./src/connector/geo-graticule');
require('./src/connector/geojson');
require('./src/connector/graph');
require('./src/connector/hexjson');
require('./src/connector/hierarchy');
require('./src/connector/topojson');

// transforms
// static
require('./src/transform/default');
require('./src/transform/filter');
require('./src/transform/fold');
require('./src/transform/map');
require('./src/transform/partition');
require('./src/transform/percent');
require('./src/transform/pick');
require('./src/transform/proportion');
require('./src/transform/rename');
require('./src/transform/reverse');
require('./src/transform/sort');
require('./src/transform/sort-by');
require('./src/transform/subset');
// imputation
require('./src/transform/fill-rows');
require('./src/transform/impute');
// statistics
require('./src/transform/aggregate');
// regression
require('./src/transform/regression');
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
require('./src/transform/diagram/arc');
require('./src/transform/diagram/sankey');
require('./src/transform/diagram/voronoi');
// hierarchy
require('./src/transform/hierarchy/cluster');
require('./src/transform/hierarchy/compact-box');
require('./src/transform/hierarchy/dendrogram');
require('./src/transform/hierarchy/indented');
require('./src/transform/hierarchy/pack');
require('./src/transform/hierarchy/partition');
require('./src/transform/hierarchy/tree');
require('./src/transform/hierarchy/treemap');
// tag cloud
require('./src/transform/tag-cloud');
// waffle
require('./src/transform/waffle');
// kernel smoothing
require('./src/transform/kernel-smooth/density');
require('./src/transform/kernel-smooth/regression');

module.exports = require('./src/data-set');
