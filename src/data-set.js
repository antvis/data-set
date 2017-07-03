const assign = require('lodash/assign');
const EventEmitter = require('wolfy87-eventemitter');
const DataView = require('./data-view');

class DataSet extends EventEmitter {
  constructor() {
    super();
    const me = this;
    assign(me, {
      _onChangeTimer: null,
      DataSet,
      isDataSet: true,
      states: {},
      views: {}
    });
  }

  createView(name) {
    const me = this;
    const view = new DataView(me);
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
    if (me._onChangeTimer) {
      clearTimeout(me._onChangeTimer);
    }
    me._onChangeTimer = setTimeout(() => {
      me.trigger('change');
    }, 16); // execute after one frame
  }
}

assign(DataSet, {
  DataSet,
  DataView,
  connectors: {},
  transforms: {},

  registerConnector(name, connector) {
    DataSet.connectors[name] = connector;
  },

  getConnector(name) {
    return DataSet.connectors[name] || DataSet.connectors.default;
  },

  registerTransform(name, transform) {
    DataSet.transforms[name] = transform;
  },

  getTransform(name) {
    return DataSet.transforms[name] || DataSet.transforms.default;
  }
});

module.exports = DataSet;
