const {
  registerTransform
} = require('../../data-set');

function transform(/* dv, options */) {
}

registerTransform('kernel-smooth.density', transform);
registerTransform('kernel.density', transform);

module.exports = {
};
