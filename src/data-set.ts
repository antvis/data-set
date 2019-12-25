import { assign, isNil, isObject, uniqueId } from '@antv/util';
import EventEmitter from 'wolfy87-eventemitter';
import { View, ViewOptions } from './view';
import CONSTANTS from './constants';

export interface DataSetOptions {
  state: Record<string, any>;
}

/**
 * 数据集
 * @public
 */
export class DataSet extends EventEmitter {
  /**
   * 常量，譬如 DataSet.CONSTANTS.HIERARCHY 是树形结构的名称
   */
  static CONSTANTS = CONSTANTS;

  /**
   * 注册的 Connector（key-value 对）
   */
  static connectors: Record<string, any> = {};

  /**
   * 已注册的 Transform（key-value 对）
   */
  static transforms: Record<string, any> = {};

  /**
   * 注册一个数据连接函数，注册后所有数据视图都可以使用 name 来引用这个数据连接函数，从而接入某种数据源。
   * @param name - 类型
   * @param connector - 解析逻辑
   */
  static registerConnector(name: string, connector: (data: any, options: any, view: View) => any): void {
    DataSet.connectors[name] = connector;
  }

  static getConnector(name: string): Function {
    return DataSet.connectors[name] || DataSet.connectors.default;
  }

  /**
   * 注册一个数据处理函数，注册后所有数据视图都可以使用 name 来引用这个数据处理函数，从而进行某种数据处理
   * @param name - transform 类型
   * @param transform - transform逻辑
   */
  static registerTransform(name: string, transform: any): void {
    DataSet.transforms[name] = transform;
  }

  static getTransform(name?: string): Function {
    return DataSet.transforms[name] || DataSet.transforms.default;
  }

  static DataSet: typeof DataSet = DataSet;

  static DataView: typeof View = View; // alias

  static View: typeof View = View;

  static version = '____DATASET_VERSION____';

  /**
   * 否是 DataSet
   */
  isDataSet = true;

  private _onChangeTimer: null | number = null;
  /**
   * 所有挂在数据集上的数据视图（key-value 对）
   */
  views: Record<string, View> = {};
  /**
   * 存储数据集上的状态量（key-value 对）
   */
  state: Record<string, any> = {};

  /**
   * @param initialProps - 初始状态
   */
  constructor(initialProps: DataSetOptions = { state: {} }) {
    super();
    // assign(me, initialProps);
    this.state = initialProps.state;
  }

  private _getUniqueViewName(): string {
    let name = uniqueId('view_');
    while (this.views[name]) {
      name = uniqueId('view_');
    }
    return name;
  }

  /**
   * 创建并返回一个数据视图实例
   * @param name - 数据视图名称
   * @param options - 视图配置
   */
  createView(name: ViewOptions): View;
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

  /**
   * 返回 name 对应的数据视图实例
   * @param name - name
   */
  getView(name: string): View {
    return this.views[name];
  }

  /**
   * 设置 name 对应的数据视图实例为 dv
   * @param name - 名称
   * @param view - data view
   */
  setView(name: string, view: View): void {
    this.views[name] = view;
  }

  /**
   * 设置状态量 name 的值为 value
   * @param name - 状态名
   * @param value - 值
   */
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
