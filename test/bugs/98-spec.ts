import { expect } from 'chai';
import DataSet from '../../src';
import { View } from '../../src/view';

describe('no error when size is [0, 0]', () => {
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

  it('size: [0, 0]', () => {
    expect(() => {
      dv.transform({
        type: 'tag-cloud',
        size: [0, 0],
        imageMask: new Image(),
      });
    }).to.not.throw();
  });
});
