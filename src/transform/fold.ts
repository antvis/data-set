import { assign, difference, pick } from '@antv/util';
import DataSet from '../data-set';
import { getFields } from '../util/option-parser';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  fields: [],
  key: 'key',
  retains: [],
  value: 'value',
};

interface Options {
  fields: string[];
  key: string;
  retains: string[];
  value: string;
}

DataSet.registerTransform('fold', (dataView: View, options: Options) => {
  const columns = dataView.getColumnNames();
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  let fields = getFields(options);
  if (fields.length === 0) {
    console.warn('warning: option fields is not specified, will fold all columns.');
    fields = columns;
  }
  const key = options.key;
  const value = options.value;
  let retains = options.retains;
  if (retains.length === 0) {
    retains = difference(columns, fields);
  }
  const resultRows: any[] = [];
  dataView.rows.forEach((row) => {
    fields.forEach((field) => {
      const resultRow = pick(row, retains);
      resultRow[key] = field;
      resultRow[value] = row[field];
      resultRows.push(resultRow);
    });
  });
  dataView.rows = resultRows;
});
