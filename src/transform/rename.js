const forIn = require('@antv/util/lib/each');
const isPlainObject = require('@antv/util/lib/type/isPlainObject');
const isString = require('@antv/util/lib/type/isString');
const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

function transform(dataView, options = {}) {
  const map = options.map || {};
  const cleanMap = {};
  if (isPlainObject(map)) {
    forIn(map, (value, key) => {
      if (isString(value) && isString(key)) {
        cleanMap[key] = value;
      }
    });
  }
  dataView.rows.forEach(row => {
    forIn(map, (newKey, key) => {
      const temp = row[key];
      delete row[key];
      row[newKey] = temp;
    });
  });
}

registerTransform('rename', transform);
registerTransform('rename-fields', transform);
