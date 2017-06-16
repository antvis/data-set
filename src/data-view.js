const EventEmitter = require('wolfy87-eventemitter');
const assign = require('lodash/assign');
const cloneDeep = require('lodash/cloneDeep');
const filter = require('lodash/filter');
const find = require('lodash/find');
const isArray = require('lodash/isArray');
const isMatch = require('lodash/isMatch');
const isString = require('lodash/isString');

class DataView extends EventEmitter {
  constructor(dataSet) {
    super();
    const me = this;
    if (!dataSet || !dataSet.isDataSet) {
      throw new TypeError('Not a valid DataSet instance');
    }
    assign(me, {
      DataSet: dataSet.DataSet,
      dataSet,
      isDataView: true,
      origin: [],
      rows: [],
      transforms: []
    });
  }

  getColumns() {
  }

  source(source, options) {
    const me = this;
    if (!options) {
      if (source instanceof DataView || isString(source)) {
        me.origin = me.DataSet.getConnector('default')(source, me.dataSet);
      } else if (isArray(source)) {
        // TODO branch: if source is like ['dataview1', 'dataview2']
        me.origin = cloneDeep(source);
      } else {
        throw new TypeError('Invalid source');
      }
    } else {
      me.origin = me.DataSet.getConnector(options.type)(source, options);
    }
    me._source = {
      source,
      options
    };
    me.rows = cloneDeep(me.origin);
    return me;
  }

  transform(options = {}) {
    const me = this;
    const transform = me.DataSet.getTransform(options.type);
    me.transforms.push(options);
    transform(me, options);
    return me;
  }

  addRow(row) {
    this.rows.push(row);
  }

  removeRow(index) {
    this.rows.splice(index, 1);
  }

  updateRow(index, newRow) {
    this.rows[index] = newRow;
  }

  findRows(query) {
    return filter(this.rows, row => isMatch(row, query));
  }

  findRow(query) {
    return find(this.rows, query);
  }

  execute() {
  }
}

module.exports = DataView;
