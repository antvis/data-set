const EventEmitter = require('wolfy87-eventemitter');
const assign = require('lodash/assign');
const clone = require('lodash/clone');
const each = require('lodash/each');
const filter = require('lodash/filter');
const find = require('lodash/find');
const forIn = require('lodash/forIn');
const indexOf = require('lodash/indexOf');
const isArray = require('lodash/isArray');
const isMatch = require('lodash/isMatch');
const isString = require('lodash/isString');
const keys = require('lodash/keys');
const map = require('lodash/map');
const pick = require('lodash/pick');
const cloneItems = require('./util/clone-items');

class DataView extends EventEmitter {
  // constructor
  constructor(dataSet) {
    super();
    const me = this;
    if (!dataSet || !dataSet.isDataSet) {
      throw new TypeError('Not a valid DataSet instance');
    }
    assign(me, {
      DataSet: dataSet.DataSet,
      dataSet,
      dataType: 'table',
      isDataView: true,
      origin: [],
      rows: [],
      transforms: []
    });
    dataSet.on('statechange', () => {
      me._reExecute();
    });
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
    forIn(optionsCloned, (value, key) => {
      if (isString(value) && /^\$state\./.test(value)) {
        optionsCloned[key] = me._parseStateExpression(value);
      }
    });
    return optionsCloned;
  }

  // connectors
  source(source, options) {
    const me = this;
    // warning me.origin is protected
    me._source = {
      source,
      options
    };
    if (!options) {
      if (source instanceof DataView || isString(source)) {
        me.origin = me.DataSet.getConnector('default')(source, me.dataSet);
      } else if (isArray(source)) {
        // TODO branch: if source is like ['dataview1', 'dataview2']
        me.origin = source;
      } else {
        throw new TypeError('Invalid source');
      }
    } else {
      options = me._preparseOptions(options);
      me.origin = me.DataSet.getConnector(options.type)(source, options, me);
    }
    if (!me.rows || me.rows.length !== me.origin.length) { // allow connectors to access 'rows'
      me.rows = cloneItems(me.origin);
    }
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
    const transform = me.DataSet.getTransform(options.type);
    transform(me, options);
  }
  _reExecuteTransforms() {
    const me = this;
    each(me.transforms, options => {
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
    return filter(this.rows, row => isMatch(row, query));
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
    return indexOf(columnNames, columnName);
  }
  getColumn(columnName) {
    return map(this.rows, row => row[columnName]);
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
    me.source(source, options);
    me._reExecuteTransforms();
    me.trigger('change');
  }
}

module.exports = DataView;
