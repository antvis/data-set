import { assign, forIn, isArray } from '@antv/util';
import { getFields } from '../../util/option-parser';
import { View } from '../../view';
import { range } from '../default';

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
  bins?: number[];
  offset?: number[];
  sizeByCount?: boolean;
  fields: [string, string];
  binWidth?: number[];
}

const SQRT3 = Math.sqrt(3);
const THIRD_PI = Math.PI / 3;
const ANGLES = [0, THIRD_PI, 2 * THIRD_PI, 3 * THIRD_PI, 4 * THIRD_PI, 5 * THIRD_PI];

function distance(x0: number, y0: number, x1: number, y1: number): number {
  return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}

function nearestBinsCenters(value: number, scale: number, offset: number): [number, number] {
  const temp = value - offset;
  scale = scale / 2;
  const div = Math.floor(temp / scale);
  const rounded = scale * (div + (Math.abs(div % 2) === 1 ? 1 : 0));
  const roundedScaled = scale * (div + (Math.abs(div % 2) === 1 ? 0 : 1));
  return [rounded + offset, roundedScaled + offset];
}

function generateBins(points: [number, number][], binWidth = [1, 1], offset = [0, 0]): object {
  // processing aligned data
  const bins: any = {};
  const [binWidthX, binWidthY] = binWidth;
  const [offsetX, offsetY] = offset;
  points.forEach((point) => {
    const [x, y] = point;
    // step3.1: nearest two centers
    const [xRounded, xRoundedScaled] = nearestBinsCenters(x, binWidthX, offsetX);
    const [yRounded, yRoundedScaled] = nearestBinsCenters(y, binWidthY, offsetY);
    // step3.2: compare distances
    const d1 = distance(x, y, xRounded, yRounded);
    const d2 = distance(x, y, xRoundedScaled, yRoundedScaled);
    let binKey;
    let binX;
    let binY;

    if (d1 < d2) {
      binKey = `x${xRounded}y${yRounded}`;
      [binX, binY] = [xRounded, yRounded];
    } else {
      binKey = `x${xRoundedScaled}y${yRoundedScaled}`;
      [binX, binY] = [xRoundedScaled, yRoundedScaled];
    }
    bins[binKey] = bins[binKey] || {
      x: binX,
      y: binY,
      count: 0,
    };
    bins[binKey].count++;
  });
  return bins;
}

const hexagon = (items: View['rows'], options: Options): any[] => {
  const rows = [...(items || [])];
  // step1: get binWidth, etc.
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('Invalid fields: it must be an array with 2 strings!');
  }
  const [fieldX, fieldY] = fields;
  const rangeFieldX = range(rows, fieldX);
  const rangeFieldY = range(rows, fieldY);
  const widthX = rangeFieldX[1] - rangeFieldX[0];
  const widthY = rangeFieldY[1] - rangeFieldY[0];
  let binWidth = options.binWidth || [];
  if (binWidth.length !== 2) {
    const [binsX, binsY] = options.bins;
    if (binsX <= 0 || binsY <= 0) {
      throw new TypeError('Invalid bins: must be an array with two positive numbers (e.g. [ 30, 30 ])!');
    }
    binWidth = [widthX / binsX, widthY / binsY];
  }
  // step2: align scale (squash Y)
  /*
   * binWidthX / binWidthY should be Math.sqrt3 / 1.5
   * -: binWidthX |: binWidthY
   *           3
   *           |
   *   4       |        2
   *           |
   *           |
   *   5----------------1
   *
   *           0
   */
  const [offsetX, offsetY] = options.offset;
  const yScale = (3 * binWidth[0]) / (SQRT3 * binWidth[1]);
  // const yScale = binWidth[0] / (SQRT3 * binWidth[1]);
  const points: [number, number][] = rows.map((row) => [row[fieldX], yScale * row[fieldY]]);
  // step3: binning
  const bins = generateBins(points, [binWidth[0], yScale * binWidth[1]], [offsetX, yScale * offsetY]);
  // step4: restore scale (for Y)
  const [asX, asY, asCount] = options.as;
  if (!asX || !asY || !asCount) {
    throw new TypeError('Invalid as: it must be an array with three elements (e.g. [ "x", "y", "count" ])!');
  }
  const radius = binWidth[0] / SQRT3;
  const hexagonPoints = ANGLES.map((angle) => [Math.sin(angle) * radius, -Math.cos(angle) * radius]);
  const result: any[] = [];
  let maxCount = 0;
  if (options.sizeByCount) {
    forIn(bins, (bin) => {
      if (bin.count > maxCount) {
        maxCount = bin.count;
      }
    });
  }
  forIn(bins, (bin) => {
    const { x, y, count } = bin;
    const row: any = {};
    row[asCount] = count;
    if (options.sizeByCount) {
      row[asX] = hexagonPoints.map((p) => x + (bin.count / maxCount) * p[0]);
      row[asY] = hexagonPoints.map((p) => (y + (bin.count / maxCount) * p[1]) / yScale);
    } else {
      row[asX] = hexagonPoints.map((p) => x + p[0]);
      row[asY] = hexagonPoints.map((p) => (y + p[1]) / yScale);
    }
    result.push(row);
  });
  return result;
};

function hexagonTransform(dataView: View, options: Options): void {
  dataView.rows = hexagon(dataView.rows, options);
}

export { hexagon, hexagonTransform };
