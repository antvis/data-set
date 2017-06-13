import assign from 'lodash/assign';
import isMatch from 'lodash/isMatch';
import filter from 'lodash/filter';
import find from 'lodash/find';
import EventEmitter from 'wolfy87-eventemitter';

class DataView extends EventEmitter {
  constructor(dataSet) {
    super();
    const me = this;
    assign(me, {
      dataSet,
      isDataView: true,
      origin: [],
      rows: [],
      columns: [],
      transforms: []
    });
  }

  getConnector(type) {
    return this.dataSet.DataSet.getConnector(type);
  }

  source(source, options) {
    const me = this;
    if (source instanceof DataView) {
      me.origin = source;
    } else {
      me.origin = me.getConnector(options.type).parse(source);
    }
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

export default DataView;
