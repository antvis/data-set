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

import { defaultTransform } from './transform/default';
import { filterTransform } from './transform/filter';
import { foldTransform } from './transform/fold';
import { mapTransform } from './transform/map';
import { partitionTransform } from './transform/partition';
import { percentTransform } from './transform/percent';
import { pickTransform } from './transform/pick';
import { proportionTransform } from './transform/proportion';
import { renameTransform } from './transform/rename';
import { reverseTransform } from './transform/reverse';
import { sortTransform } from './transform/sort';
import { sortByTransform } from './transform/sort-by';
import { subsetTransform } from './transform/subset';
import { groupTransform } from './transform/group';
// imputation
import { fillRowsTransform } from './transform/fill-rows';

import { imputeTransform } from './transform/impute';
// statistics
import { aggregateTransform } from './transform/aggregate';
// regression
import { regressionTransform } from './transform/regression';
// KDE
import { kdeTransform } from './transform/kde';
// binning
import { hexagonTransform } from './transform/bin/hexagon';
import { histogramTransform } from './transform/bin/histogram';
import { quantileTransform } from './transform/bin/quantile';
import { rectangleTransform } from './transform/bin/rectangle';
// geo
import { centroidTransform } from './transform/geo/centroid';
import { projectionTransform } from './transform/geo/projection';
import { regionTransform } from './transform/geo/region';

// diagram
import { arcTransform } from './transform/diagram/arc';
import { dagreTransform } from './transform/diagram/dagre';
import { sankeyTransform } from './transform/diagram/sankey';
import { voronoiTransform } from './transform/diagram/voronoi';

// hierarchy
import { clusterTransform } from './transform/hierarchy/cluster';
import { compactBoxTransform } from './transform/hierarchy/compact-box';
import { dendrogramTransform } from './transform/hierarchy/dendrogram';
import { indentedTransform } from './transform/hierarchy/indented';
import { packTransform } from './transform/hierarchy/pack';
import { adjacencyTransform } from './transform/hierarchy/partition';
import { treeTransform } from './transform/hierarchy/tree';
import { treemapTransform } from './transform/hierarchy/treemap';

// tag cloud
import { tagCloudTransform } from './transform/tag-cloud';
// waffle
import { waffleTransform } from './transform/waffle';
// kernel smoothing
import { kernelSmoothDensityTransform } from './transform/kernel-smooth/density';
import { kernelRegressionTransform } from './transform/kernel-smooth/regression';

import { DataSet } from './data-set';

DataSet.registerTransform('default', defaultTransform);
DataSet.registerTransform('aggregate', aggregateTransform);
DataSet.registerTransform('summary', aggregateTransform);
DataSet.registerTransform('fill-rows', fillRowsTransform);
DataSet.registerTransform('fillRows', fillRowsTransform);
DataSet.registerTransform('filter', filterTransform);
DataSet.registerTransform('fold', foldTransform);
DataSet.registerTransform('impute', imputeTransform);
DataSet.registerTransform('kernel-density-estimation', kdeTransform);
DataSet.registerTransform('kde', kdeTransform);
DataSet.registerTransform('KDE', kdeTransform);
DataSet.registerTransform('map', mapTransform);
DataSet.registerTransform('partition', partitionTransform);
DataSet.registerTransform('group', groupTransform);
DataSet.registerTransform('groups', groupTransform);
DataSet.registerTransform('percent', percentTransform);
DataSet.registerTransform('pick', pickTransform);
DataSet.registerTransform('proportion', proportionTransform);
DataSet.registerTransform('regression', regressionTransform);
DataSet.registerTransform('rename', renameTransform);
DataSet.registerTransform('rename-fields', renameTransform);
DataSet.registerTransform('reverse', reverseTransform);
DataSet.registerTransform('sort-by', sortByTransform);
DataSet.registerTransform('sortBy', sortByTransform);
DataSet.registerTransform('sort', sortTransform);
DataSet.registerTransform('subset', subsetTransform);
DataSet.registerTransform('waffle', waffleTransform);
DataSet.registerTransform('bin.hexagon', hexagonTransform);
DataSet.registerTransform('bin.hex', hexagonTransform);
DataSet.registerTransform('hexbin', hexagonTransform);
DataSet.registerTransform('bin.histogram', histogramTransform);
DataSet.registerTransform('bin.dot', histogramTransform);
DataSet.registerTransform('bin.quantile', quantileTransform);
DataSet.registerTransform('bin.rectangle', rectangleTransform);
DataSet.registerTransform('bin.rect', rectangleTransform);
DataSet.registerTransform('diagram.arc', arcTransform);
DataSet.registerTransform('arc', arcTransform);
DataSet.registerTransform('diagram.dagre', dagreTransform);
DataSet.registerTransform('dagre', dagreTransform);
DataSet.registerTransform('diagram.sankey', sankeyTransform);
DataSet.registerTransform('sankey', sankeyTransform);
DataSet.registerTransform('diagram.voronoi', voronoiTransform);
DataSet.registerTransform('voronoi', voronoiTransform);
DataSet.registerTransform('geo.centroid', centroidTransform);
DataSet.registerTransform('geo.projection', projectionTransform);
DataSet.registerTransform('geo.region', regionTransform);
DataSet.registerTransform('hierarchy.cluster', clusterTransform);
DataSet.registerTransform('dendrogram', clusterTransform);
DataSet.registerTransform('hierarchy.compact-box', compactBoxTransform);
DataSet.registerTransform('compact-box-tree', compactBoxTransform);
DataSet.registerTransform('non-layered-tidy-tree', compactBoxTransform);
DataSet.registerTransform('mindmap-logical', compactBoxTransform);
DataSet.registerTransform('hierarchy.dendrogram', dendrogramTransform);
DataSet.registerTransform('dendrogram', dendrogramTransform);
DataSet.registerTransform('hierarchy.indented', indentedTransform);
DataSet.registerTransform('indented-tree', indentedTransform);
DataSet.registerTransform('hierarchy.pack', packTransform);
DataSet.registerTransform('hierarchy.circle-packing', packTransform);
DataSet.registerTransform('circle-packing', packTransform);
DataSet.registerTransform('hierarchy.partition', adjacencyTransform);
DataSet.registerTransform('adjacency', adjacencyTransform);
DataSet.registerTransform('hierarchy.tree', treeTransform);
DataSet.registerTransform('tree', treeTransform);
DataSet.registerTransform('hierarchy.treemap', treemapTransform);
DataSet.registerTransform('treemap', treemapTransform);
DataSet.registerTransform('kernel-smooth.density', kernelSmoothDensityTransform);
DataSet.registerTransform('kernel.density', kernelSmoothDensityTransform);
DataSet.registerTransform('kernel-smooth.regression', kernelRegressionTransform);
DataSet.registerTransform('kernel.regression', kernelRegressionTransform);
DataSet.registerTransform('tag-cloud', tagCloudTransform);
DataSet.registerTransform('word-cloud', tagCloudTransform);

export = DataSet;
