const assign = require('lodash/assign');

class Transform {
  constructor(options) {
    assign(this, options);
  }
  callback(view) {
    return view;
  }
}

module.exports = Transform;
