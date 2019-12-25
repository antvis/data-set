import * as simpleStatistics from 'simple-statistics';
import { assign, flattenDeep, isArray } from '@antv/util';
import { View } from '../view';
import pByFraction from '../util/p-by-fraction';
import constants from '../constants';

const { STATISTICS_METHODS } = constants;

function getColumnValues(view: View, column: string): any[] {
  let values = view.getColumn(column);
  if (isArray(values) && isArray(values[0])) {
    values = flattenDeep(values);
  }
  return values;
}

// statistics
STATISTICS_METHODS.forEach((method) => {
  // @ts-ignore;
  View.prototype[method] = function(column: string) {
    // @ts-ignore
    return simpleStatistics[method](getColumnValues(this, column));
  };
});

const { quantile } = simpleStatistics;

assign(View.prototype, {
  average: View.prototype.mean,
  quantile(column: string, p: number) {
    return quantile(getColumnValues(this, column), p);
  },
  quantiles(this: View, column: string, pArr: number[]) {
    const columnArr = getColumnValues(this, column);
    return pArr.map((p) => quantile(columnArr, p));
  },
  quantilesByFraction(column: string, fraction: number) {
    return this.quantiles(column, pByFraction(fraction));
  },
  range(column: string) {
    return [this.min(column), this.max(column)];
  },
  extent(column: string) {
    // alias
    return this.range(column);
  },
});

export interface StatisticsApi {
  max(column: string): number;
  mean(column: string): number; // alias: average
  median(column: string): number;
  min(column: string): number;
  mode(column: string): number;
  product(column: string): number;
  standardDeviation(column: string): number;
  sum(column: string): number;
  sumSimple(column: string): number;
  variance(column: string): number;
  average(column: string): number;
  extent(column: string): number;
  range(column: string): [number, number];
  quantilesByFraction(column: string, fraction: number): number;
  quantiles(column: string, percents: number[]): number[];
  quantile(column: string, percent: number): number;
}
