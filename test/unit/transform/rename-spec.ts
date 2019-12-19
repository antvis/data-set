import { expect } from 'chai';
import DataSet from '../../../src';
import { View } from '../../../src/view';
const { getTransform } = DataSet;

describe('View.transform(): rename', () => {
  const data = [{ a: 1, b: 2 }];
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('rename')).to.be.a('function');
    expect(getTransform('rename-fields')).to.be.a('function');
    expect(getTransform('rename-fields')).to.equal(getTransform('rename'));
  });

  it('default', () => {
    dv.transform({
      type: 'rename',
    });
    expect(dv.rows).to.eql(data);
  });

  it('map', () => {
    dv.transform({
      type: 'rename',
      map: {
        a: 'c',
      },
    });
    expect(dv.rows).to.eql([{ c: 1, b: 2 }]);
  });
});
