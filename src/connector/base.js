const assign = require('lodash/assign');

class Connector {
  constructor(options) {
    assign(this, options);
  }

  parse(src/* , options*/) {
    return src;
  }
}

module.exports = Connector;
