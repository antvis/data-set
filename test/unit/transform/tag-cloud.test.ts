/**
 * @jest-environment jsdom
 */

import DataSet from '../../../src';
import { DataItem, tagCloudTransform } from '../../../src/transform/tag-cloud';
import { View } from '../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): tag-cloud', () => {
  DataSet.registerTransform('tag-cloud', tagCloudTransform);
  DataSet.registerTransform('word-cloud', tagCloudTransform);

  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(
      ['Hello', 'world', 'normally', 'you', 'want', 'more', 'words', 'than', 'this'].map((d) => {
        return {
          text: d,
          value: 10 + Math.random() * 90,
          test: 'haha',
        };
      })
    );
  });

  it('api', () => {
    expect(typeof getTransform('tag-cloud')).toBe('function');
    expect(typeof getTransform('word-cloud')).toBe('function');
    expect(getTransform('word-cloud') === getTransform('tag-cloud')).toEqual(true);
  });

  it('default', () => {
    dv.transform({
      type: 'tag-cloud',
    });
    const firstRow = dv.rows[0];
    // expect(dv.rows.length).to.equal(dv.origin.length);
    expect(firstRow.hasText).toEqual(true);
    expect(typeof firstRow.x).toBe('number');
    expect(typeof firstRow.y).toBe('number');
    expect(typeof firstRow.text).toBe('string');
    expect(typeof firstRow.size).toBe('number');
    expect(typeof firstRow.font).toBe('string');
  });

  it('callback', () => {
    const common = (row: DataItem) => {
      expect(typeof row.text).toBe('string');
      expect(typeof row.value).toBe('number');
    };
    const font = (row: DataItem) => {
      common(row);
      return 'font-test';
    };
    const fontWeight = (row: DataItem): any => {
      common(row);
      return 'fontWeight-test';
    };
    const fontSize = (row: DataItem) => {
      common(row);
      return 11;
    };
    const rotate = (row: DataItem) => {
      common(row);
      return 22;
    };
    const padding = (row: DataItem) => {
      common(row);
      return 33;
    };
    const spiral = (size: [number, number]) => {
      expect(size.length).toEqual(2);
      const e = size[0] / size[1];
      return function(t: number) {
        expect(typeof t).toBe('number');
        return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
      };
    };

    dv.transform({
      type: 'tag-cloud',
      font,
      fontWeight,
      fontSize,
      rotate,
      padding,
      spiral,
    });
    const firstRow = dv.rows[0];
    expect(firstRow.hasText).toEqual(true);
    expect(typeof firstRow.x).toBe('number');
    expect(typeof firstRow.y).toBe('number');
    expect(typeof firstRow.text).toBe('string');
    expect(firstRow.font).toEqual('font-test');
    expect(firstRow.weight).toEqual('fontWeight-test');
    expect(firstRow.size).toEqual(11);
    expect(firstRow.rotate).toEqual(22);
    expect(firstRow.padding).toEqual(33);
  });

  it('size', () => {
    dv.transform({
      type: 'tag-cloud',
      size: [0, 0], // 当宽或者高为 0 时，容不下任何一个词语
    });

    expect(dv.rows.length).toEqual(0);
  });
});
