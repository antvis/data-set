const assign = require('lodash/assign');
const EventEmitter = require('wolfy87-eventemitter');
const Connector = require('./connector/base');
const Transform = require('./transform/base');
const DataView = require('./data-view');

class DataSet extends EventEmitter {
  constructor() {
    super();
    const me = this;
    assign(me, {
      DataSet,
      isDataSet: true,
      states: {},
      views: {}
    });
  }

  createView(name) {
    const me = this;
    const view = new DataView();
    me.views[name] = view;
    return view;
  }

  getView(name) {
    return this.views[name];
  }

  setView(name, view) {
    this.views[name] = view;
  }

  setState(name, value) {
    const me = this;
    me.states[name] = value;
    me.trigger('change');
  }
}

assign(DataSet, {
  DataView,
  Connector,
  Transform,
  connectors: {},
  transforms: {},

  registerConnector(name, connector) {
    DataSet.connectors[name] = connector;
  },

  getConnector(name) {
    return DataSet.connectors[name] || new Connector();
  },

  registerTransform(name, transform) {
    DataSet.transforms[name] = transform;
  },

  getTransform(name) {
    return DataSet.transforms[name] || new Transform();
  }
});

module.exports = DataSet;
