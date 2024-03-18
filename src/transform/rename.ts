import { forIn, isPlainObject, isString } from '@antv/util';

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

const rename = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  const map = options.map || {};
  const cleanMap: Record<string, string> = {};
  if (isPlainObject(map)) {
    forIn(map, (value, key) => {
      if (isString(value) && isString(key)) {
        cleanMap[key] = value;
      }
    });
  }
  rows.forEach((row) => {
    forIn(cleanMap, (newKey, key) => {
      const temp = row[key];
      delete row[key];
      row[newKey] = temp;
    });
  });

  return rows;
};

function renameTransform(dataView: View, options: Options): void {
  dataView.rows = rename(dataView.rows, options);
}

export { rename, renameTransform };
