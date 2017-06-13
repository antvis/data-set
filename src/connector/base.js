import assign from 'lodash/assign';

class Connector {
  constructor(options) {
    assign(this, options);
  }

  parse(src/* , options*/) {
    return src;
  }
}

export default Connector;
