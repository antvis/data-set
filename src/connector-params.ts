import { Options as GraphOptions } from './connector/graph';
import { Options as DsvOptions } from './connector/dsv';
import { Options as HexjsonOptions } from './connector/hexjson';
import { Options as HierarchyOptions } from './connector/hierarchy';
import { Options as TopojsonOptions } from './connector/topojson';

export interface ConnectorParams {
  csv: [string, {}];
  tsv: [string, {}];
  dsv: [string, DsvOptions];
  graph: [any, GraphOptions];
  diagram: [any, GraphOptions];
  hex: [any[], HexjsonOptions];
  hexjson: [any[], HexjsonOptions];
  'hex-json': [any[], HexjsonOptions];
  HexJSON: [any[], HexjsonOptions];
  geo: [any, {}];
  geojson: [any, {}];
  GeoJSON: [any, {}];
  hierarchy: [any, HierarchyOptions];
  tree: [any, HierarchyOptions];
  topojson: [any, TopojsonOptions];
  TopoJSON: [any, TopojsonOptions];
}
