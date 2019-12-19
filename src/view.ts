import EventEmitter from 'wolfy87-eventemitter';
import {
  assign,
  clone,
  deepMix,
  find,
  forIn,
  isArray,
  isPlainObject,
  isMatch,
  isObject,
  isString,
  keys,
  pick,
} from '@antv/util';
import { DataSet } from './data-set';
import { StatisticsApi } from './api/statistics';
import { PartitionApi } from './api/partition';
import { HierarchyApi } from './api/hierarchy';
import { GeoApi } from './api/geo';
import { TransformsParams } from './transform-params';
import { ConnectorParams } from './connector-params';

function cloneOptions(options: any): any {
  const result: any = {};
  forIn(options as any, (value: any, key: string) => {
    if (isObject(value) && (value as any).isView) {
      result[key] = value;
    } else if (isArray(value)) {
      result[key] = value.concat([]);
    } else if (isPlainObject(value)) {
      result[key] = clone(value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

export interface ViewOptions {
  watchingStates?: string[];
}

type TransformOptions<T extends keyof TransformsParams = any> = { type: T } & TransformsParams[T];
type ConnectorOptions<T extends keyof ConnectorParams = any> = { type: T } & ConnectorParams[T][1];

interface CustomSource {
  source: any;
  options: any;
}

/**
 * 数据视图
 * @public
 */
export class View extends EventEmitter {
  static DataSet: typeof DataSet;
  /**
   * 关联的数据集
   */
  dataSet: DataSet | null;
  /**
   * 是否关联了数据集
   */
  loose: boolean;
  /**
   * 是否是View
   */
  isView = true;
  /**
   * 是否是View
   */
  isDataView = true; // alias
  /**
   *
   */
  private watchingStates: string[] | null = null;
  /**
   * 数据视图类型
   */
  dataType = 'table';
  /**
   * 已应用的 transform
   */
  transforms: TransformOptions[] = [];
  /**
   * 原始数据
   */
  origin: any[] = [];
  /**
   * 存储处理后的数据
   */
  rows: any[] = [];
  _source!: CustomSource;

  // tag cloud
  _tagCloud: any;

  // graph
  graph!: {
    nodes: any[];
    edges: any[];
  };
  nodes!: any[];
  edges!: any[];

  // geo
  _projectedAs!: string[];
  // hexjson
  _gridRows!: any;
  _HexJSON: any;
  _GridHexJSON: any;

  constructor(options?: ViewOptions);
  constructor(dataSet?: DataSet, options?: ViewOptions);
  constructor(dataSet?: any, options?: any) {
    super();
    if (dataSet && dataSet.isDataSet) {
      this.dataSet = dataSet;
    } else {
      this.dataSet = null;
      options = dataSet;
    }
    this.loose = !this.dataSet;
    // TODO:
    // assign(me, options);
    if (options) {
      this.watchingStates = options.watchingStates;
    }
    if (!this.loose) {
      const { watchingStates } = this;
      dataSet.on('statechange', (name: string) => {
        if (isArray(watchingStates)) {
          if (watchingStates.indexOf(name) > -1) {
            this._reExecute();
          }
        } else {
          this._reExecute();
        }
      });
    }
  }

  private _parseStateExpression(expr: string): string | undefined {
    const dataSet = this.dataSet;
    if (dataSet === null) return undefined;
    const matched = /^\$state\.(\w+)/.exec(expr);
    if (matched) {
      return dataSet.state[matched[1]];
    }
    return expr;
  }

  private _preparseOptions(options: any): any {
    const optionsCloned = cloneOptions(options);
    if (this.loose) {
      return optionsCloned;
    }
    forIn(optionsCloned, (value, key) => {
      if (isString(value) && /^\$state\./.test(value)) {
        optionsCloned[key] = this._parseStateExpression(value);
      }
    });
    return optionsCloned;
  }

  // connectors
  private _prepareSource(source: any, options?: any): View {
    // warning me.origin is protected
    this._source = { source, options };
    if (!options) {
      if (source instanceof View || isString(source)) {
        this.origin = View.DataSet.getConnector('default')(source, this.dataSet);
      } else if (isArray(source)) {
        // TODO branch: if source is like ['dataview1', 'dataview2']
        this.origin = source;
      } else if (isObject(source) && (source as ConnectorOptions).type) {
        const opts = this._preparseOptions(source); // connector without source
        this.origin = View.DataSet.getConnector(opts.type)(opts, this);
      } else {
        throw new TypeError('Invalid source');
      }
    } else {
      const opts = this._preparseOptions(options);
      this.origin = View.DataSet.getConnector(opts.type)(source, opts, this);
    }
    this.rows = deepMix([], this.origin);
    return this;
  }

  /**
   * 载入数据
   *
   * @remarks
   * data 是原始数据，可能是字符串，也可能是数组、对象，或者另一个数据视图实例。options 里指定了载入数据使用的 connector 和载入时使用的配置项。
   *
   * @param source - 数据
   * @param options- 数据解析配置
   */
  source(source: string): View;
  source(source: any[]): View;
  source(source: View): View;
  source<T extends keyof ConnectorParams>(source: ConnectorParams[T][0], options: ConnectorOptions<T>): View;
  source(source: any, options?: any): View {
    this._prepareSource(source, options)._reExecuteTransforms();
    this.trigger('change', []);
    return this;
  }

  /**
   *  执行数据处理数据。执行完这个函数后，transform 会被存储
   * @param options - 某种类型的transform
   */
  transform<T extends keyof TransformsParams>(options?: TransformOptions<T>): View {
    if (options && options.type) {
      this.transforms.push(options);
      this._executeTransform(options);
    }
    return this;
  }

  private _executeTransform(options: TransformOptions): void {
    options = this._preparseOptions(options);
    const transform = View.DataSet.getTransform(options.type);
    transform(this, options);
  }

  private _reExecuteTransforms(): void {
    this.transforms.forEach((options) => {
      this._executeTransform(options);
    });
  }

  addRow(row: any): void {
    this.rows.push(row);
  }

  removeRow(index: number): void {
    this.rows.splice(index, 1);
  }

  updateRow(index: number, newRow: any): void {
    assign(this.rows[index], newRow);
  }

  findRows(query: any): any[] {
    return this.rows.filter((row) => isMatch(row, query));
  }

  findRow(query: any): any {
    return find(this.rows, query);
  }

  // columns
  getColumnNames(): string[] {
    const firstRow = this.rows[0];
    if (firstRow) {
      return keys(firstRow);
    }
    return [];
  }

  getColumnName(index: number): string {
    return this.getColumnNames()[index];
  }

  getColumnIndex(columnName: string): number {
    const columnNames = this.getColumnNames();
    return columnNames.indexOf(columnName);
  }

  getColumn(columnName: string): any[] {
    return this.rows.map((row) => row[columnName]);
  }

  getColumnData(columnName: string): any[] {
    return this.getColumn(columnName);
  }

  // data process
  getSubset(startRowIndex: number, endRowIndex: number, columnNames: string[]): any[] {
    const subset = [];
    for (let i = startRowIndex; i <= endRowIndex; i++) {
      subset.push(pick(this.rows[i], columnNames));
    }
    return subset;
  }

  toString(prettyPrint = false): string {
    if (prettyPrint) {
      return JSON.stringify(this.rows, null, 2);
    }
    return JSON.stringify(this.rows);
  }

  private _reExecute(): void {
    const { source, options } = this._source;
    this._prepareSource(source, options);
    this._reExecuteTransforms();
    this.trigger('change', []);
  }
}

export interface View extends StatisticsApi, PartitionApi, HierarchyApi, GeoApi {}
