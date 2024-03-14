import { View } from '../view';

function defaultCallback(row: any): boolean {
  return !!row;
}

export interface Options {
  callback?(item: any): boolean;
}

const filter = (rows: View['rows'], options: Options): any[] => {
  return rows.filter(options.callback || defaultCallback);
};

const filterTransform = (dataView: View, options: Options): void => {
  dataView.rows = filter(dataView.rows, options);
};

export { filter, filterTransform };
