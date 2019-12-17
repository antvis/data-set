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
import DataSet from './data-set';
import { StatisticsApi } from './api/statistics';
import { PartitionApi } from './api/partition';
import { HierarchyApi } from './api/hierarchy';
import { GeoApi } from './api/geo';

export interface Params {}

function cloneOptions(options: any) {
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
  watchingStates: string[];
}

interface TransformOptions {
  type: string;
  [key: string]: any;
}

interface ConnectorOptions {
  type: string;
  [key: string]: any;
}

interface CustomSource {
  source: any;
  options: any;
}

export class View extends EventEmitter {
  static DataSet: typeof DataSet;
  // constructor
  dataSet: DataSet | null;
  loose: boolean;
  isView = true;
  isDataView = true; // alias
  watchingStates: string[] | null = null;
  dataType = 'table';
  transforms: TransformOptions[] = [];
  protected origin: any[] = [];
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

  private _parseStateExpression(expr: string) {
    const dataSet = this.dataSet;
    if (dataSet === null) return;
    const matched = /^\$state\.(\w+)/.exec(expr);
    if (matched) {
      return dataSet.state[matched[1]];
    }
    return expr;
  }

  private _preparseOptions(options: any) {
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
  private _prepareSource(source: View): View;
  private _prepareSource(source: ConnectorOptions): View;
  private _prepareSource(source: string, options: ConnectorOptions): View;
  private _prepareSource(source: any[], options?: ConnectorOptions): View;
  private _prepareSource(source: any, options?: ConnectorOptions): View {
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

  source(source: View): View;
  source(options: ConnectorOptions): View;
  source(source: string, options: ConnectorOptions): View;
  source(source: any[], options?: ConnectorOptions): View;
  source(source: any, options?: ConnectorOptions): View {
    this._prepareSource(source, options)._reExecuteTransforms();
    this.trigger('change', []);
    return this;
  }

  // transforms
  transform(options: TransformOptions) {
    if (options && options.type) {
      this.transforms.push(options);
      this._executeTransform(options);
    }
    return this;
  }

  private _executeTransform(options: TransformOptions) {
    options = this._preparseOptions(options);
    const transform = View.DataSet.getTransform(options.type);
    transform(this, options);
  }

  private _reExecuteTransforms() {
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

  private _reExecute() {
    const { source, options } = this._source;
    this._prepareSource(source, options);
    this._reExecuteTransforms();
    this.trigger('change', []);
  }
}

export interface View extends StatisticsApi, PartitionApi, HierarchyApi, GeoApi {}
