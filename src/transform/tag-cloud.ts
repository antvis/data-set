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

export interface Options {
  fields?: [string, string];
  font?(): string;
  fontSize?: number;
  rotate?: number;
  padding?: number;
  size?: [number, number];
  spiral?: 'archimedean' | 'archimedean' | 'rectangular';
  timeInterval?: number;
  imageMask?: HTMLImageElement;
}

function transform(dataView: View, options: Options): void {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const layout = tagCloud();
  ['font', 'fontSize', 'padding', 'rotate', 'size', 'spiral', 'timeInterval'].forEach((key) => {
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
  const result = layout.start();
  const tags: any[] = result._tags;
  const bounds = result._bounds;
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
