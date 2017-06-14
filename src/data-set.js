import assign from 'lodash/assign';
import EventEmitter from 'wolfy87-eventemitter';
import Connector from './connector/base';
import Transform from './transform/base';
import DataView from './data-view';

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
  Transforms: {},

  registerConnector(name, connector) {
    DataSet.connectors[name] = connector;
  },

  getConnector(name) {
    return DataSet.connectors[name];
  },

  registerTransform(name, Transform) {
    DataSet.Transforms[name] = Transform;
  },

  getTransform(name) {
    return DataSet.Transforms[name];
  }
});

export default DataSet;
