const {
  standardDeviation
} = require('simple-statistics');

module.exports = {
  silverman(arr) {
    const stdev = standardDeviation(arr);
    const num = 4 * Math.pow(stdev, 5);
    const denom = 3 * arr.length;
    return Math.pow(num / denom, 0.2);
  }
};
