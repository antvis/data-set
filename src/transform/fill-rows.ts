import { assign, forIn } from '@antv/util';
import partition from '../util/partition';
import { DataSet } from '../data-set';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  fillBy: 'group', // group | order
  groupBy: [],
  orderBy: [],
};

export interface Options {
  fillBy?: 'group' | 'order';
  groupBy?: string[];
  orderBy?: string[];
}

function arrayDifference(arr1: string[], arr2: string[]): string[] {
  // arrayDifference([1, 1, 1, 2], [1, 2]) => [1, 1]
  const shadow = arr1.map((item) => item); // shadow copy
  arr2.forEach((item) => {
    const index = shadow.indexOf(item);
    if (index > -1) {
      shadow.splice(index, 1);
    }
  });
  return shadow;
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const rows = dataView.rows;
  const groupBy = options.groupBy;
  const orderBy = options.orderBy;
  const groups = partition(rows, groupBy, orderBy);
  let maxLength = 0;
  let referenceGroup: any[] = [];
  forIn(groups, (group) => {
    if (group.length > maxLength) {
      maxLength = group.length;
      referenceGroup = group;
    }
  });
  const referenceOrderByKeys: string[] = [];
  const referenceRowByOrderByKey: any = {};
  referenceGroup.forEach((row) => {
    const key = orderBy!.map((col) => row[col]).join('-');
    referenceOrderByKeys.push(key);
    referenceRowByOrderByKey[key] = row;
  });
  if (options.fillBy === 'order') {
    const first = referenceGroup[0];
    const allOrderByKeys: string[] = [];
    const rowByOrderByKey: any = {};
    rows.forEach((row) => {
      const key = orderBy!.map((col) => row[col]).join('-');
      if (allOrderByKeys.indexOf(key) === -1) {
        allOrderByKeys.push(key);
        rowByOrderByKey[key] = row;
      }
    });
    const _missingOrderByKeys = arrayDifference(allOrderByKeys, referenceOrderByKeys);
    _missingOrderByKeys.forEach((key) => {
      const row: any = {};
      groupBy.forEach((col) => {
        row[col] = first[col];
      });
      orderBy!.forEach((col) => {
        row[col] = rowByOrderByKey[key][col];
      });
      rows.push(row);
      referenceGroup.push(row);
      referenceOrderByKeys.push(key);
      referenceRowByOrderByKey[key] = row;
    });
    maxLength = referenceGroup.length;
  }
  forIn(groups, (group: any[]) => {
    if (group !== referenceGroup && group.length < maxLength) {
      const first = group[0];
      // missing orderBy keys
      const orderByKeys: string[] = [];
      group.forEach((row) => {
        orderByKeys.push(orderBy!.map((col) => row[col]).join('-'));
      });
      const missingOrderByKeys = arrayDifference(referenceOrderByKeys, orderByKeys);
      missingOrderByKeys.some((key, i) => {
        if (i >= maxLength - group.length) {
          // group length overflow
          return true;
        }
        const referenceRow = referenceRowByOrderByKey[key];
        const row: any = {};
        groupBy.forEach((col) => {
          row[col] = first[col];
        });
        orderBy!.forEach((col) => {
          row[col] = referenceRow[col];
        });
        rows.push(row);
        return false;
      });
    }
  });
}

DataSet.registerTransform('fill-rows', transform);
DataSet.registerTransform('fillRows', transform);
