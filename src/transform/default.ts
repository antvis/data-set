import { keys, pick } from '@antv/util';
import { View } from '../view';
import { flattenDeep, isArray } from '@antv/util';
import * as simpleStatistcs from 'simple-statistics';

const getColumn = (rows: any[], columnName: string): any[] => {
  return (rows || []).map((row) => row[columnName]);
};
const getColumnNames = (rows: any[]): string[] => {
  rows = rows || [];
  const firstRow = rows[0];
  if (firstRow) {
    return keys(firstRow);
  }
  return [];
};

const getColumnName = (rows: any[], index: number): string => {
  return getColumnNames(rows)[index];
};

const getColumnValues = (rows: View['rows'], column: string): any[] => {
  let values = getColumn(rows, column);
  if (isArray(values) && isArray(values[0])) {
    values = flattenDeep(values);
  }
  return values;
};

const min = (rows: any[], column: string): number => {
  const values = getColumnValues(rows, column);
  return simpleStatistcs.min(values);
};

const max = (rows: any[], column: string): number => {
  const values = getColumnValues(rows, column);
  return simpleStatistcs.max(values);
};

const range = (rows: any[], column: string): [number, number] => {
  return [min(rows, column), max(rows, column)];
};

// data process
const getSubset = (rows: any[], startRowIndex: number, endRowIndex: number, columnNames: string[]): any[] => {
  const subset = [];
  for (let i = startRowIndex; i <= endRowIndex; i++) {
    subset.push(pick(rows[i], columnNames));
  }
  return subset;
};

const defaultTransform = (dataView: View): View => {
  return dataView;
};

export { defaultTransform, getColumn, getColumnNames, range, getColumnName, getSubset };
