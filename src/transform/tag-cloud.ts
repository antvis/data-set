import { assign, isString } from '@antv/util';
import { DataSet } from '../data-set';
import tagCloud from '../util/tag-cloud';
import { getFields } from '../util/option-parser';
import { View } from '../view';

const DEFAULT_OPTIONS: Options = {
  fields: ['text', 'value'], // fields to keep
  font: () => 'serif',
  padding: 1,
  size: [500, 500],
  spiral: 'archimedean', // 'archimedean' || 'rectangular' || {function}
  // timeInterval: Infinity // max execute time
  timeInterval: 500, // max execute time
  // imageMask: '', // instance of Image, must be loaded
};

type FontWeight = number | 'normal' | 'bold' | 'bolder' | 'lighter';

export interface DataItem {
  /** 文本内容 */
  text: string;
  /** 该文本所占权重 */
  value: number;
}

export interface Options {
  fields?: [string, string];
  font?: string | ((row: DataItem) => string);
  fontSize?: number | ((row: DataItem) => number);
  fontWeight?: FontWeight | ((row: DataItem) => FontWeight);
  rotate?: number | ((row: DataItem) => number);
  padding?: number | ((row: DataItem) => number);
  size?: [number, number];
  spiral?: 'archimedean' | 'rectangular' | ((size: [number, number]) => (t: number) => number[]);
  timeInterval?: number;
  imageMask?: HTMLImageElement;
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const layout = tagCloud();

  // 当宽或者高为 0 时，容不下任何一个词语,
  // 所以最后的数据应该是一个空数组。
  if (!options.size[0] || !options.size[1]) {
    dataView.rows = [];
    dataView._tagCloud = layout;
    return;
  }

  ['font', 'fontSize', 'fontWeight', 'padding', 'rotate', 'size', 'spiral', 'timeInterval'].forEach((key) => {
    // @ts-ignore
    if (options[key]) {
      // @ts-ignore
      layout[key](options[key]);
    }
  });
  const fields = getFields(options);
  const [text, value] = fields;
  if (!isString(text) || !isString(value)) {
    throw new TypeError('Invalid fields: must be an array with 2 strings (e.g. [ "text", "value" ])!');
  }
  const words = dataView.rows.map((row) => {
    row.text = row[text];
    row.value = row[value];
    return row;
  });
  layout.words(words);
  if (options.imageMask) {
    layout.createMask(options.imageMask);
  }

  // 这里的 result 和 layout 指向同一个对象
  const result = layout.start();
  const tags: any[] = result._tags;
  const bounds = result._bounds || [
    { x: 0, y: 0 },
    { x: options.size[0], y: options.size[1] },
  ];
  tags.forEach((tag) => {
    tag.x += options.size[0] / 2;
    tag.y += options.size[1] / 2;
  });
  const [w, h] = options.size;
  const hasImage = result.hasImage;
  tags.push({
    text: '',
    value: 0,
    x: hasImage ? 0 : bounds[0].x,
    y: hasImage ? 0 : bounds[0].y,
    opacity: 0,
  });
  tags.push({
    text: '',
    value: 0,
    x: hasImage ? w : bounds[1].x,
    y: hasImage ? h : bounds[1].y,
    opacity: 0,
  });
  dataView.rows = tags;
  dataView._tagCloud = result;
}

DataSet.registerTransform('tag-cloud', transform);
DataSet.registerTransform('word-cloud', transform);
