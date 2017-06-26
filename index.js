// connectors
require('./src/connector/default');
require('./src/connector/dsv');
require('./src/connector/geo');

// transforms
require('./src/transform/default');
require('./src/transform/filter');
require('./src/transform/fold');
require('./src/transform/map');
require('./src/transform/pick');
require('./src/transform/reverse');
require('./src/transform/sort');
require('./src/transform/sort-by');
require('./src/transform/subset');

module.exports = require('./src/data-set');
