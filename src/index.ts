// extra APIs
import './api/geo';
import './api/hierarchy';
import './api/partition';
import './api/statistics';

// connectors
import './connector/default';
import './connector/dsv';
import './connector/geo-graticule';
import './connector/geojson';
import './connector/graph';
import './connector/hexjson';
import './connector/hierarchy';
import './connector/topojson';

// transforms
// static
import './transform/default';
import './transform/filter';
import './transform/fold';
import './transform/map';
import './transform/partition';
import './transform/percent';
import './transform/pick';
import './transform/proportion';
import './transform/rename';
import './transform/reverse';
import './transform/sort';
import './transform/sort-by';
import './transform/subset';
// imputation
import './transform/fill-rows';
import './transform/impute';
// statistics
import './transform/aggregate';
// regression
import './transform/regression';
// KDE
import './transform/kde';
// binning
import './transform/bin/hexagon';
import './transform/bin/histogram';
import './transform/bin/quantile';
import './transform/bin/rectangle';
// geo
import './transform/geo/centroid';
import './transform/geo/projection';
import './transform/geo/region';
// diagram
import './transform/diagram/arc';
import './transform/diagram/dagre';
import './transform/diagram/sankey';
import './transform/diagram/voronoi';
// hierarchy
import './transform/hierarchy/cluster';
import './transform/hierarchy/compact-box';
import './transform/hierarchy/dendrogram';
import './transform/hierarchy/indented';
import './transform/hierarchy/pack';
import './transform/hierarchy/partition';
import './transform/hierarchy/tree';
import './transform/hierarchy/treemap';
// tag cloud
import './transform/tag-cloud';
// waffle
import './transform/waffle';
// kernel smoothing
import './transform/kernel-smooth/density';
import './transform/kernel-smooth/regression';

import { DataSet } from './data-set';

export = DataSet;
