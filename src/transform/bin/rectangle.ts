import { assign, forIn } from '@antv/util';
import { DataSet } from '../../data-set';
const { registerTransform } = DataSet;
import { getFields } from '../../util/option-parser';
import { View } from '../../view';

const DEFAULT_OPTIONS: Partial<Options> = {
  as: ['x', 'y', 'count'],
  bins: [30, 30], // Numeric vector giving number of bins in both horizontal and vertical directions
  offset: [0, 0],
  sizeByCount: false, // calculate bin size by binning count
  // fields: ['field0', 'field1'], // required
  // binWidth: [ 30, 30 ], // Numeric vector giving bin width in both horizontal and vertical directions. Overrides bins if both set.
};

export interface Options {
  as?: [string, string, string];
  bins?: [number, number];
  offset?: [number, number];
  sizeByCount?: boolean;
  fields: [string, string];
  binWidth?: [number, number];
}

function nearestBin(value: number, scale: number, offset: number): [number, number] {
  const temp = value - offset;
  const div = Math.floor(temp / scale);
  return [div * scale + offset, (div + 1) * scale + offset];
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const [fieldX, fieldY] = getFields(options);
  if (!fieldX || !fieldY) {
    throw new TypeError('Invalid fields: must be an array with 2 strings!');
  }
  const rangeFieldX = dataView.range(fieldX);
  const rangeFieldY = dataView.range(fieldY);
  const widthX = rangeFieldX[1] - rangeFieldX[0];
  const widthY = rangeFieldY[1] - rangeFieldY[0];
  let binWidth = options.binWidth || [];
  if (binWidth.length !== 2) {
    const [binsX, binsY] = options.bins;
    if (binsX <= 0 || binsY <= 0) {
      throw new TypeError('Invalid bins: must be an array with 2 positive numbers (e.g. [ 30, 30 ])!');
    }
    binWidth = [widthX / binsX, widthY / binsY];
  }
  const points = dataView.rows.map((row) => [row[fieldX], row[fieldY]]);
  const bins: any = {};
  const [offsetX, offsetY] = options.offset;
  points.forEach((point) => {
    const [x0, x1] = nearestBin(point[0], binWidth[0], offsetX);
    const [y0, y1] = nearestBin(point[1], binWidth[1], offsetY);
    const binKey = `${x0}-${x1}-${y0}-${y1}`;
    bins[binKey] = bins[binKey] || {
      x0,
      x1,
      y0,
      y1,
      count: 0,
    };
    bins[binKey].count++;
  });
  const rows: any = [];
  const [asX, asY, asCount] = options.as;
  if (!asX || !asY || !asCount) {
    throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "count" ])!');
  }
  /* points
   * 3---2
   * |   |
   * 0---1
   */
  if (!options.sizeByCount) {
    forIn(bins, (bin: any) => {
      const row: any = {};
      row[asX] = [bin.x0, bin.x1, bin.x1, bin.x0];
      row[asY] = [bin.y0, bin.y0, bin.y1, bin.y1];
      row[asCount] = bin.count;
      rows.push(row);
    });
  } else {
    let maxCount = 0;
    forIn(bins, (bin) => {
      if (bin.count > maxCount) {
        maxCount = bin.count;
      }
    });
    forIn(bins, (bin: any) => {
      const { x0, x1, y0, y1, count } = bin;
      const scale = count / maxCount;
      const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
      const rx = ((x1 - x0) * scale) / 2;
      const ry = ((y1 - y0) * scale) / 2;
      const x01 = cx - rx;
      const x11 = cx + rx;
      const y01 = cy - ry;
      const y11 = cy + ry;
      const row: any = {};
      row[asX] = [x01, x11, x11, x01];
      row[asY] = [y01, y01, y11, y11];
      row[asCount] = count;
      rows.push(row);
    });
  }
  dataView.rows = rows;
}

registerTransform('bin.rectangle', transform);
registerTransform('bin.rect', transform);
