import { DataSet } from '../data-set';
import defaultConnector from './default';
import { dsvConnector, tsvConnector, csvConnector } from './dsv';
import geoGraticuleconnector from './geo-graticule';
import GeoJSONConnector from './geojson';
import graphConnector from './graph';
import HexJSONConnector from './hexjson';
import hierarchyConnector from './hierarchy';
import TopoJSONConnector from './topojson';

// 统一注册connector
DataSet.registerConnector('default', defaultConnector);

DataSet.registerConnector('dsv', dsvConnector);
DataSet.registerConnector('tsv', tsvConnector);
DataSet.registerConnector('csv', csvConnector);

DataSet.registerConnector('geo-graticule', geoGraticuleconnector);

DataSet.registerConnector('geo', GeoJSONConnector);
DataSet.registerConnector('geojson', GeoJSONConnector);
DataSet.registerConnector('GeoJSON', GeoJSONConnector);

DataSet.registerConnector('graph', graphConnector);
DataSet.registerConnector('diagram', graphConnector);

DataSet.registerConnector('hex', HexJSONConnector);
DataSet.registerConnector('hexjson', HexJSONConnector);
DataSet.registerConnector('hex-json', HexJSONConnector);
DataSet.registerConnector('HexJSON', HexJSONConnector);

DataSet.registerConnector('hierarchy', hierarchyConnector);
DataSet.registerConnector('tree', hierarchyConnector);

DataSet.registerConnector('topojson', TopoJSONConnector);
DataSet.registerConnector('TopoJSON', TopoJSONConnector);
