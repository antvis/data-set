const assign = require('lodash/assign');
const map = require('lodash/map');
const {
  max,
  mean,
  median,
  min,
  mode,
  quantile,
  standardDeviation,
  sum,
  variance
} = require('simple-statistics');
const DataView = require('../data-view');
const pByFraction = require('../util/p-by-fraction');

assign(DataView.prototype, {
  // statistics
  max(column) {
    return max(this.getColumn(column));
  },
  mean(column) {
    return mean(this.getColumn(column));
  },
  average(column) { // alias
    return this.mean(column);
  },
  median(column) {
    return median(this.getColumn(column));
  },
  min(column) {
    return min(this.getColumn(column));
  },
  mode(column) {
    return mode(this.getColumn(column));
  },
  quantile(column, p) {
    return quantile(this.getColumn(column), p);
  },
  quantiles(column, pArr) {
    const columnArr = this.getColumn(column);
    return map(pArr, p => quantile(columnArr, p));
  },
  quantilesByFraction(column, fraction) {
    return this.quantiles(column, pByFraction(fraction));
  },
  standardDeviation(column) {
    return standardDeviation(this.getColumn(column));
  },
  sum(column) {
    return sum(this.getColumn(column));
  },
  variance(column) {
    return variance(this.getColumn(column));
  },
  range(column) {
    const me = this;
    return [ me.min(column), me.max(column) ];
  },
  extent(column) { // alias
    return this.range(column);
  }
});
