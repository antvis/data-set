const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'filter',
 *   callback,
 * }
 */

function transform() {
}

registerTransform('fill-rows', transform);
registerTransform('fillRows', transform);
