const EventEmitter = require('wolfy87-eventemitter');
const assign = require('lodash/assign');
const clone = require('lodash/clone');
const cloneDeep = require('lodash/cloneDeep');
const find = require('lodash/find');
const forIn = require('lodash/forIn');
const isArray = require('lodash/isArray');
const isMatch = require('lodash/isMatch');
const isObject = require('lodash/isObject');
const isString = require('lodash/isString');
const keys = require('lodash/keys');
const pick = require('lodash/pick');

class View extends EventEmitter {
  // constructor
  constructor(dataSet, options) {
    super();
    const me = this;
    options = options || {};
    dataSet = dataSet || {};
    if (!dataSet.isDataSet) {
      options = dataSet;
      dataSet = null;
    }
    assign(me, {
      dataSet,
      loose: !dataSet,
      dataType: 'table',
      isView: true,
      isDataView: true, // alias
      origin: [],
      rows: [],
      transforms: [],
      watchingStates: null
    }, options);
    if (!me.loose) {
      const { watchingStates } = me;
      dataSet.on('statechange', name => {
        if (isArray(watchingStates)) {
          if (watchingStates.indexOf(name) > -1) {
            me._reExecute();
          }
        } else {
          me._reExecute();
        }
      });
    }
  }

  _parseStateExpression(expr) {
    const dataSet = this.dataSet;
    const matched = /^\$state\.(\w+)/.exec(expr);
    if (matched) {
      return dataSet.state[matched[1]];
    }
    return expr;
  }

  _preparseOptions(options) {
    const me = this;
    const optionsCloned = clone(options);
    if (me.loose) {
      return optionsCloned;
    }
    forIn(optionsCloned, (value, key) => {
      if (isString(value) && /^\$state\./.test(value)) {
        optionsCloned[key] = me._parseStateExpression(value);
      }
    });
    return optionsCloned;
  }

  // connectors
  _prepareSource(source, options) {
    const me = this;
    const DataSet = View.DataSet;
    // warning me.origin is protected
    me._source = {
      source,
      options
    };
    if (!options) {
      if (source instanceof View || isString(source)) {
        me.origin = DataSet.getConnector('default')(source, me.dataSet);
      } else if (isArray(source)) {
        // TODO branch: if source is like ['dataview1', 'dataview2']
        me.origin = source;
      } else if (isObject(source) && source.type) {
        options = me._preparseOptions(source); // connector without source
        me.origin = DataSet.getConnector(options.type)(options, me);
      } else {
        throw new TypeError('Invalid source');
      }
    } else {
      options = me._preparseOptions(options);
      me.origin = DataSet.getConnector(options.type)(source, options, me);
    }
    me.rows = cloneDeep(me.origin);
    return me;
  }

  source(source, options) {
    const me = this;
    me._prepareSource(source, options);
    me._reExecuteTransforms();
    me.trigger('change');
    return me;
  }

  // transforms
  transform(options = {}) {
    const me = this;
    me.transforms.push(options);
    me._executeTransform(options);
    return me;
  }
  _executeTransform(options) {
    const me = this;
    options = me._preparseOptions(options);
    const transform = View.DataSet.getTransform(options.type);
    transform(me, options);
  }
  _reExecuteTransforms() {
    const me = this;
    me.transforms.forEach(options => {
      me._executeTransform(options);
    });
  }

  // rows
  addRow(row) {
    this.rows.push(row);
  }
  removeRow(index) {
    this.rows.splice(index, 1);
  }
  updateRow(index, newRow) {
    assign(this.rows[index], newRow);
  }
  findRows(query) {
    return this.rows.filter(row => isMatch(row, query));
  }
  findRow(query) {
    return find(this.rows, query);
  }

  // columns
  getColumnNames() {
    const firstRow = this.rows[0];
    if (firstRow) {
      return keys(firstRow);
    }
    return [];
  }
  getColumnName(index) {
    return this.getColumnNames()[index];
  }
  getColumnIndex(columnName) {
    const columnNames = this.getColumnNames();
    return columnNames.indexOf(columnName);
  }
  getColumn(columnName) {
    return this.rows.map(row => row[columnName]);
  }
  getColumnData(columnName) {
    return this.getColumn(columnName);
  }

  // data process
  getSubset(startRowIndex, endRowIndex, columnNames) {
    const subset = [];
    for (let i = startRowIndex; i <= endRowIndex; i++) {
      subset.push(pick(this.rows[i], columnNames));
    }
    return subset;
  }
  toString(prettyPrint) {
    const me = this;
    if (prettyPrint) {
      return JSON.stringify(me.rows, null, 2);
    }
    return JSON.stringify(me.rows);
  }
  _reExecute() {
    const me = this;
    const {
      source,
      options
    } = me._source;
    me._prepareSource(source, options);
    me._reExecuteTransforms();
    me.trigger('change');
  }
}

module.exports = View;
