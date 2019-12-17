import { isString } from '@antv/util';
import { feature } from 'topojson-client';
import GeoJSONConnector from './geojson';
import DataSet from '../data-set';
import { View } from '../view';
import { Topology } from 'topojson-specification';

function TopoJSONConnector(data: Topology, options: { object: string }, dataView: View) {
  const object = options.object;
  if (!isString(object)) {
    throw new TypeError('Invalid object: must be a string!');
  }
  const geoData = feature(data, data.objects[object]);
  return GeoJSONConnector(geoData, undefined, dataView);
}

DataSet.registerConnector('topojson', TopoJSONConnector);
DataSet.registerConnector('TopoJSON', TopoJSONConnector);
