import { deepMix, assign } from '@antv/util';
import { getGridForHexJSON, renderHexJSON } from 'd3-hexjson';
import { DataSet } from '../data-set';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  width: 1,
  height: 1,
};

export interface Options {
  width?: number;
  height?: number;
}

function processRow(row) {
  row.cx = row.x;
  row.cy = row.y;
  row.x = [];
  row.y = [];
  row.vertices.forEach((v) => {
    row.x.push(v.x + row.cx);
    row.y.push(v.y + row.cy);
  });
  return row;
}

function HexJSONConnector(data: any[], options: Options, dataView: View): any {
  dataView.dataType = DataSet.CONSTANTS.HEX;
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const { width, height } = options;
  const HexJSON = deepMix([], data);
  dataView._HexJSON = HexJSON;
  const grid = (dataView._GridHexJSON = getGridForHexJSON(HexJSON));
  const rows = (dataView.rows = renderHexJSON(HexJSON, width, height).map(processRow));
  dataView._gridRows = renderHexJSON(grid, width, height).map(processRow);
  return rows;
}

DataSet.registerConnector('hex', HexJSONConnector);
DataSet.registerConnector('hexjson', HexJSONConnector);
DataSet.registerConnector('hex-json', HexJSONConnector);
DataSet.registerConnector('HexJSON', HexJSONConnector);

export default HexJSONConnector;
