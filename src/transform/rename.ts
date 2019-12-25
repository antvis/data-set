import { forIn, isPlainObject, isString } from '@antv/util';
import { DataSet } from '../data-set';
import { View } from '../view';

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

export interface Options {
  map?: Record<string, string>;
}

function transform(dataView: View, options: Options): void {
  const map = options.map || {};
  const cleanMap: Record<string, string> = {};
  if (isPlainObject(map)) {
    forIn(map, (value, key) => {
      if (isString(value) && isString(key)) {
        cleanMap[key] = value;
      }
    });
  }
  dataView.rows.forEach((row) => {
    forIn(cleanMap, (newKey, key) => {
      const temp = row[key];
      delete row[key];
      row[newKey] = temp;
    });
  });
}

DataSet.registerTransform('rename', transform);
DataSet.registerTransform('rename-fields', transform);
