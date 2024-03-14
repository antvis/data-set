export interface Options {
  callback?(item: any, index: number, arr: any[]): any;
}

function defaultCallback(row: any): any {
  return row;
}

const map = (items: any[], options: Options): any[] => {
  const rows = [...(items || [])];
  return (rows || []).map(options.callback || defaultCallback);
};

const mapTransform = (dataView: any, options: Options): void => {
  dataView.rows = map(dataView.rows, options);
};
export { map, mapTransform };
