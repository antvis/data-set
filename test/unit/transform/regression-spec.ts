// const regression = require('regression');
import { each } from 'lodash';
import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import re from '../../../src/transform/regression';
import { View } from '../../../src/view';
const { REGRESSION_METHODS } = re;

describe('View.transform(): regression', () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    // 1~10
    const b = i % 2;
    data.push({
      a: i,
      b,
    });
  }
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('regression')).to.be.a('function');
  });

  it('default: linear', () => {
    dv.transform({
      type: 'regression',
      fields: ['a', 'b'],
    });
    expect(dv.rows.length).to.equal(6);
  });

  each(REGRESSION_METHODS, (method) => {
    it(`method: ${method}`, () => {
      dv.transform({
        type: 'regression',
        fields: ['a', 'b'],
      });
      expect(dv.rows.length).to.equal(6);
    });
  });
});
