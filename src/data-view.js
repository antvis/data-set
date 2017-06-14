const assign = require('lodash/assign');
const isMatch = require('lodash/isMatch');
const filter = require('lodash/filter');
const find = require('lodash/find');
const EventEmitter = require('wolfy87-eventemitter');

class DataView extends EventEmitter {
  constructor(dataSet) {
    super();
    const me = this;
    assign(me, {
      dataSet,
      isDataView: true,
      origin: [],
      rows: [],
      transforms: []
    });
  }

  getColumns() {
  }

  getConnector(type) {
    return this.dataSet.DataSet.getConnector(type);
  }

  source(source, options = {}) {
    const me = this;
    if (source instanceof DataView) {
      me.origin = source;
    } else {
      me.origin = me.getConnector(options.type).parse(source, options);
    }
    return me;
  }

  transform(options = {}) {
    const me = this;
    const transform = me.getTransform(options.type);
    me.transforms.push(transform);
    transform.callback(me, options);
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
