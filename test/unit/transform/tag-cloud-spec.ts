import { expect } from 'chai';
import DataSet from '../../../src';
import { DataItem } from '../../../src/transform/tag-cloud';
import { View } from '../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): tag-cloud', () => {
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
    expect(getTransform('tag-cloud')).to.be.a('function');
    expect(getTransform('word-cloud')).to.be.a('function');
    expect(getTransform('word-cloud') === getTransform('tag-cloud')).to.equal(true);
  });

  it('default', () => {
    dv.transform({
      type: 'tag-cloud',
    });
    const firstRow = dv.rows[0];
    // expect(dv.rows.length).to.equal(dv.origin.length);
    expect(firstRow.hasText).to.equal(true);
    expect(firstRow.x).to.be.a('number');
    expect(firstRow.y).to.be.a('number');
    expect(firstRow.text).to.be.a('string');
    expect(firstRow.size).to.be.a('number');
    expect(firstRow.font).to.be.a('string');
  });

  it('callback', () => {
    const common = (row: DataItem) => {
      expect(row.text).to.be.a('string');
      expect(row.value).to.be.a('number');
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
      expect(size.length).to.equal(2);
      const e = size[0] / size[1];
      return function(t: number) {
        expect(t).to.be.a('number');
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
    expect(firstRow.hasText).to.equal(true);
    expect(firstRow.x).to.be.a('number');
    expect(firstRow.y).to.be.a('number');
    expect(firstRow.text).to.be.a('string');
    expect(firstRow.font).to.equal('font-test');
    expect(firstRow.weight).to.equal('fontWeight-test');
    expect(firstRow.size).to.equal(11);
    expect(firstRow.rotate).to.equal(22);
    expect(firstRow.padding).to.equal(33);
  });

  it('size', () => {
    dv.transform({
      type: 'tag-cloud',
      size: [0, 0], // 当宽或者高为 0 时，容不下任何一个词语
    });

    expect(dv.rows.length).to.equal(0);
  });
});
