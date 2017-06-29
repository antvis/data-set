const assign = require('lodash/assign');
const {
  max,
  mean,
  median,
  min,
  mode,
  standardDeviation,
  sum,
  variance
} = require('simple-statistics');
const DataView = require('../data-view');

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
