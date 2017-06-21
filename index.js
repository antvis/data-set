// connectors
require('./src/connector/default');
require('./src/connector/dsv');

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
// statistics
require('./src/transform/aggregate');
// binning
require('./src/transform/bin/hexagon');
require('./src/transform/bin/histogram');
require('./src/transform/bin/rectangle');

module.exports = require('./src/data-set');
