import { assign, isNil, isObject, uniqueId } from '@antv/util';
import EventEmitter from 'wolfy87-eventemitter';
import { View, ViewOptions } from './view';
import CONSTANTS from './constants';

interface DataSetOptions {
  state: Record<string, any>;
}

class DataSet extends EventEmitter {
  static CONSTANTS = CONSTANTS;

  static connectors: Record<string, any> = {};

  static transforms: Record<string, any> = {};

  static registerConnector(name: string, connector: any) {
    DataSet.connectors[name] = connector;
  }

  static getConnector(name: string) {
    return DataSet.connectors[name] || DataSet.connectors.default;
  }

  static registerTransform(name: string, transform: any) {
    DataSet.transforms[name] = transform;
  }

  static getTransform(name: string) {
    return DataSet.transforms[name] || DataSet.transforms.default;
  }

  static DataSet: typeof DataSet = DataSet;

  static DataView: typeof View = View; // alias

  static View: typeof View = View;

  static version = '____DATASET_VERSION____';

  isDataSet = true;
  DataSet: typeof DataSet = DataSet;
  _onChangeTimer: null | number = null;
  views: Record<string, View> = {};
  state: Record<string, any> = {};

  constructor(initialProps: DataSetOptions = { state: {} }) {
    super();
    // assign(me, initialProps);
    this.state = initialProps.state;
  }

  _getUniqueViewName(): string {
    let name = uniqueId('view_');
    while (this.views[name]) {
      name = uniqueId('view_');
    }
    return name;
  }

  createView(options: ViewOptions): View;
  createView(name?: string, options?: ViewOptions): View;
  createView(name: any, options?: any): View {
    if (isNil(name)) {
      name = this._getUniqueViewName();
    }
    if (isObject(name)) {
      options = name;
      name = this._getUniqueViewName();
    }
    if (this.views[name]) {
      throw new Error(`data view exists: ${name}`);
    }
    const view = new View(this, options);
    this.views[name] = view;
    return view;
  }

  getView(name: string): View {
    return this.views[name];
  }

  setView(name: string, view: View): void {
    this.views[name] = view;
  }

  setState(name: string, value: any): void {
    this.state[name] = value;
    if (this._onChangeTimer) {
      window.clearTimeout(this._onChangeTimer);
      this._onChangeTimer = null;
    }
    this._onChangeTimer = window.setTimeout(() => {
      this.emit('statechange', name, value);
    }, 16); // execute after one frame
  }
}

// @ts-ignore
assign(DataSet, CONSTANTS);

// @ts-ignore
assign(DataSet.prototype, {
  view: DataSet.prototype.createView, // alias
});

View.DataSet = DataSet;

export default DataSet;
