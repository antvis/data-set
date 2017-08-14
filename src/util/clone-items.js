const clone = require('lodash/clone');
const cloneDeep = require('lodash/cloneDeep');

module.exports = data => {
  if (Array.isArray(data)) {
    return data.map(item => clone(item));
  }
  if ({}.toString.call(data) === '[object Object]') {
    const result = {};
    for (const key in data) {
      result[key] = data[key];
    }
    return result;
  }
  return cloneDeep(data);
};
