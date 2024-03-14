import * as simpleStatistics from 'simple-statistics';
import { each, forIn, groupBy, map, uniq } from 'lodash';
import DataSet from '../../../src';
import { keys } from '@antv/util';
import top2000 from '../../fixtures/top2000.json';
import { View } from '../../../src/view';
import { aggregates, aggregateTransform } from '../../../src/transform/aggregate';
const { getTransform } = DataSet;

describe('View.transform(): aggregate', () => {
  const VALID_AGGREGATES = keys(aggregates);
  const data = [];
  DataSet.registerTransform('aggregate', aggregateTransform);
  DataSet.registerTransform('summary', aggregateTransform);
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
    expect(typeof getTransform('aggregate')).toBe('function');
  });

  it('default: count', () => {
    dv.transform({
      type: 'aggregate',
    });
    expect(dv.rows.length).toEqual(1);
    expect(dv.rows[0].count).toEqual(10);
  });

  it('all', () => {
    dv.transform({
      type: 'aggregate',
      fields: map(VALID_AGGREGATES, () => 'a'),
      groupBy: ['b'],
      operations: VALID_AGGREGATES,
      as: VALID_AGGREGATES,
    });
    const groups = groupBy(data, (row) => `_${row.b}`);
    const partitions = {};
    forIn(groups, (group, i) => {
      partitions[i] = map(group, (row) => row.a);
    });
    const results = map(partitions, (part, i) => {
      const result = {
        a: groups[i][0].a,
        b: groups[i][0].b,
      };
      each(VALID_AGGREGATES, (operation) => {
        if (simpleStatistics[operation]) {
          result[operation] = simpleStatistics[operation](part);
        } else if (operation === 'count') {
          result.count = part.length;
        } else if (operation === 'distinct') {
          result.distinct = uniq(part).length;
        }
      });
      return result;
    });
    expect(dv.rows).toEqual(results);
  });
});

describe('View.transform(): aggregate: performance of partition', () => {
  const t1 = Date.now();
  const ds = new DataSet();
  const dv = ds.createView('test').source(top2000);
  const t2 = Date.now();
  dv.transform({
    as: ['count'],
    groupBy: ['release'],
    operations: ['count'],
    type: 'aggregate',
  });
  const t3 = Date.now();
  it('deepClone should be done in less than 500ms', () => {
    expect(t2 - t1 < 1000).toEqual(true);
  });
  it('partition should be done in less than 500ms', () => {
    expect(t3 - t2 < 1000).toEqual(true);
  });
  it('it should be done in less than 1000ms in total', () => {
    expect(t3 - t1 < 2000).toEqual(true);
  });
});

describe('View.transform(): aggregate: fields of array', () => {
  const data = [];

  for (let i = 1; i <= 10; i++) {
    // 1~10
    data.push({
      a: [i, i + 10],
    });
  }
  const dv = new DataSet.View().source(data);

  dv.transform({
    type: 'aggregate',
    fields: ['a', 'a'],
    operations: ['max', 'min'],
    as: ['max', 'min'],
  });

  it('counting fields of arrays', () => {
    expect(dv.rows[0].max).toEqual(20);
    expect(dv.rows[0].min).toEqual(1);
  });
});
