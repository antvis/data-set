// connectors
require('./src/connector/default');
require('./src/connector/dsv');
require('./src/connector/geo');

// transforms
// static
require('./src/transform/default');
require('./src/transform/filter');
require('./src/transform/fold');
require('./src/transform/map');
require('./src/transform/pick');
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
require('./src/transform/bin/rectangle');

module.exports = require('./src/data-set');
