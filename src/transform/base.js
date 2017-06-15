const assign = require('lodash/assign');

class Transform {
  constructor(options) {
    assign(this, options);
  }
  execute(view/* , options*/) {
    return view;
  }
}

module.exports = Transform;
