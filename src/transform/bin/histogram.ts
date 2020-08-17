import { assign, forIn, pick } from '@antv/util';
import partition from '../../util/partition';
import { DataSet } from '../../data-set';
import { getField } from '../../util/option-parser';
import { View } from '../../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  as: ['x', 'count'],
  bins: undefined,
  offset: 0,
  groupBy: [],
  // field: '', // required
  // binWidth: 10, // override bins
};

export interface Options {
  as?: [string, string];
  bins?: number | undefined;
  offset?: number;
  groupBy?: string[];
  field: string;
  binWidth?: number;
}

function nearestBin(value: number, scale: number, offset: number): [number, number] {
  const temp = value - offset;
  const div = Math.floor(temp / scale);
  return [div * scale + offset, (div + 1) * scale + offset];
}

/** Sturges formula */
function sturges(dataLength: number): number {
  return Math.ceil(Math.log(dataLength) / Math.LN2) + 1;
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const field = getField(options);
  if (dataView.rows.length === 0) {
    return;
  }
  const range = dataView.range(field);
  const width = range[1] - range[0];
  let binWidth = options.binWidth;
  const bins = options.bins;

  if (!binWidth && bins) {
    if (bins <= 0) {
      throw new TypeError('Invalid bins: it must be a positive number!');
    }
    binWidth = width / bins;
  }
  if (!binWidth && !bins) {
    const binNumber = sturges(dataView.rows.length);
    binWidth = width / binNumber;
  }

  const offset = options.offset % binWidth;

  // grouping
  const rows: any[] = [];
  const groupBy = options.groupBy;
  const groups = partition(dataView.rows, groupBy);
  forIn(groups, (group: any[]) => {
    const bins: any = {};
    const column = group.map((row) => row[field]);
    column.forEach((value) => {
      const [x0, x1] = nearestBin(value, binWidth!, offset);
      const binKey = `${x0}-${x1}`;
      bins[binKey] = bins[binKey] || {
        x0,
        x1,
        count: 0,
      };
      bins[binKey].count++;
    });
    const [asX, asCount] = options.as;
    if (!asX || !asCount) {
      throw new TypeError('Invalid as: it must be an array with 2 elements (e.g. [ "x", "count" ])!');
    }

    const meta = pick(group[0], groupBy);
    forIn(bins, (bin) => {
      const row = assign({}, meta);
      row[asX] = [bin.x0, bin.x1];
      row[asCount] = bin.count;
      rows.push(row);
    });
  });
  dataView.rows = rows;
}

DataSet.registerTransform('bin.histogram', transform);
DataSet.registerTransform('bin.dot', transform);
