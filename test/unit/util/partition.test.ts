import { cloneDeep, orderBy, sortBy } from 'lodash';
import partition from '../../../src/util/partition';
import simpleSortBy from '../../../src/util/simple-sort-by';
import top2000 from '../../fixtures/top2000.json';

describe('util: partition(rows, groupBy, orderBy)', () => {
  const data = [
    { x: 0, y: 28, c: 0 },
    { x: 0, y: 55, c: 1 },
    { x: 1, y: 43, c: 0 },
  ];
  it('api', () => {
    expect(typeof partition).toBe('function');
  });

  it('groupBy', () => {
    const groups = partition(data, ['c'], ['x']);
    expect(groups._0.length).toEqual(2);
    expect(groups._1.length).toEqual(1);
  });

  xit('performance', (done) => {
    // ignoring for coverage code injection will slow down the function
    // FIXME: remove `.skip` to execute performance test

    const top2000Cloned1 = cloneDeep(top2000);
    const top2000Cloned2 = cloneDeep(top2000);
    const t0 = Date.now();
    sortBy(top2000, ['release', 'title']);
    const t1 = Date.now();
    orderBy(top2000Cloned1, ['release', 'title']);
    const t2 = Date.now();
    simpleSortBy(top2000Cloned2, ['release', 'title']);
    const t3 = Date.now();
    expect(t3 - t2 < t2 - t1).toEqual(true);
    expect(t3 - t2 < t1 - t0).toEqual(true);
    // console.log(t3 - t2, t2 - t1, t1 - t0);
    done();
  });
});
