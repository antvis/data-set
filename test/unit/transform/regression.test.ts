// const regression = require('regression');
import { each } from 'lodash';
import DataSet from '../../../src';
const { getTransform } = DataSet;

import { View } from '../../../src/view';
import { REGRESSION_METHODS, regressionTransform } from '../../../src/transform/regression';

describe('View.transform(): regression', () => {
  DataSet.registerTransform('regression', regressionTransform);

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
    expect(typeof getTransform('regression')).toBe('function');
  });

  it('default: linear', () => {
    dv.transform({
      type: 'regression',
      fields: ['a', 'b'],
    });
    expect(dv.rows.length).toEqual(6);
  });

  each(REGRESSION_METHODS, (method) => {
    it(`method: ${method}`, () => {
      dv.transform({
        type: 'regression',
        fields: ['a', 'b'],
      });
      expect(dv.rows.length).toEqual(6);
    });
  });
});
