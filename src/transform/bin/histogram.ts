import { assign, forIn, pick } from '@antv/util';
import partition from '../../util/partition';

import { getField } from '../../util/option-parser';
import { View } from '../../view';
import { range } from '../default';

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

const histogram = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const field = getField(options);
  if (rows.length === 0) {
    return [];
  }
  const ranged = range(rows, field);
  const width = ranged[1] - ranged[0];
  let binWidth = options.binWidth;
  const bins = options.bins;

  if (!binWidth && bins) {
    if (bins <= 0) {
      throw new TypeError('Invalid bins: it must be a positive number!');
    }
    binWidth = width / bins;
  }
  if (!binWidth && !bins) {
    const binNumber = sturges(rows.length);
    binWidth = width / binNumber;
  }

  const offset = options.offset % binWidth;

  // grouping
  const result: any[] = [];
  const groupBy = options.groupBy;
  const groups = partition(rows, groupBy);
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
      result.push(row);
    });
  });

  return result;
};

function histogramTransform(dataView: View, options: Options): void {
  dataView.rows = histogram(dataView.rows, options);
}

export { histogram, histogramTransform };
