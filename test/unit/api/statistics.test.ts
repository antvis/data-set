import { map, flattenDeep } from 'lodash';
import { max, mean, median, min, mode, quantile, standardDeviation, sum, variance } from 'simple-statistics';
import DataSet from '../../../src';
import populationChina from '../../fixtures/population-china.json';

describe('View API: statistics', () => {
  // statistics
  it('statistics methods', () => {
    const dv = new DataSet.View().source(populationChina);
    dv.transform({
      type: 'map',
      callback(row) {
        row.year = parseInt(row.year, 10);
        return row;
      },
    });
    const years = dv.getColumn('year');
    expect(dv.max('year')).toEqual(max(years));
    expect(dv.min('year')).toEqual(min(years));
    expect(dv.mean('year')).toEqual(mean(years));
    expect(dv.average('year')).toEqual(mean(years));
    expect(dv.median('year')).toEqual(median(years));
    expect(dv.mode('year')).toEqual(mode(years));
    expect(dv.quantile('year', 0.5)).toEqual(quantile(years, 0.5));
    expect(dv.quantiles('year', [0, 0.1, 0.5])).toEqual(map([0, 0.1, 0.5], (p) => quantile(years, p)));
    expect(dv.quantilesByFraction('year', 4)).toEqual(map([0, 0.25, 0.5, 0.75, 1], (p) => quantile(years, p)));
    expect(dv.standardDeviation('year')).toEqual(standardDeviation(years));
    expect(dv.sum('year')).toEqual(sum(years));
    expect(dv.variance('year')).toEqual(variance(years));
    expect(dv.range('year')).toEqual([min(years), max(years)]);
  });

  it('statistics methods on fields of array', () => {
    const data = [];
    for (let i = 1; i <= 10; i++) {
      // 1~10
      data.push({
        a: [i, i + 10, [-i, i * i, [-i * i, 1 / i]]],
      });
    }
    const dv = new DataSet.View().source(data);
    const values = flattenDeep(dv.getColumn('a'));
    expect(dv.max('a')).toEqual(max(values));
    expect(dv.min('a')).toEqual(min(values));
    expect(dv.mean('a')).toEqual(mean(values));
    expect(dv.average('a')).toEqual(mean(values));
    expect(dv.median('a')).toEqual(median(values));
    expect(dv.mode('a')).toEqual(mode(values));
    expect(dv.quantile('a', 0.5)).toEqual(quantile(values, 0.5));
    expect(dv.quantiles('a', [0, 0.1, 0.5])).toEqual(map([0, 0.1, 0.5], (p) => quantile(values, p)));
    expect(dv.quantilesByFraction('a', 4)).toEqual(map([0, 0.25, 0.5, 0.75, 1], (p) => quantile(values, p)));
    expect(dv.standardDeviation('a')).toEqual(standardDeviation(values));
    expect(dv.sum('a')).toEqual(sum(values));
    expect(dv.variance('a')).toEqual(variance(values));
    expect(dv.range('a')).toEqual([min(values), max(values)]);
  });
});
