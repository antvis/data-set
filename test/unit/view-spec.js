const {
  indexOf,
  isNil,
  keys,
  map
} = require('lodash');
const {
  expect
} = require('chai');
const DataSet = require('../../src/data-set');
const View = require('../../src/view');
require('../../src/transform/map');
const populationChina = require('../fixtures/population-china.json');

describe('View', () => {
  const mockRow = {
    year: '2016',
    population: '1384530000'
  };
  const columnNames = keys(populationChina[0]);

  let dv;
  beforeEach(() => {
    dv = new DataSet().createView().source(populationChina);
  });

  // constructor
  it('Constructor', () => {
    expect(View).to.be.a('function');
    expect(dv).to.be.an('object');
  });

  // rows
  it('addRow(row)', () => {
    dv.addRow(mockRow);
    expect(dv.rows.length).to.equal(dv.origin.length + 1);
  });
  it('removeRow(index)', () => {
    dv.removeRow(0);
    expect(dv.rows.length).to.equal(dv.origin.length - 1);
  });
  it('updateRow(index, newRow)', () => {
    dv.updateRow(0, mockRow);
    expect(dv.rows[0]).to.eql(mockRow);
  });
  it('findRows(query)', () => {
    dv.addRow(mockRow);
    const rows = dv.findRows({
      year: '2016'
    });
    expect(rows[0]).to.equal(mockRow);
    const rows2 = dv.findRows({
      year: '2020'
    });
    expect(rows2.length).to.equal(0);
  });
  it('findRow(query)', () => {
    dv.addRow(mockRow);
    const row = dv.findRow({
      year: '2016'
    });
    expect(row).to.equal(mockRow);
    const row2 = dv.findRow({
      year: '2020'
    });
    expect(isNil(row2)).to.be.true;
  });

  // columns
  it('getColumnNames()', () => {
    expect(dv.getColumnNames()).to.eql(columnNames);
  });
  it('getColumnName(index)', () => {
    expect(dv.getColumnName(0)).to.equal(columnNames[0]);
  });
  it('getColumnIndex(columnName)', () => {
    expect(dv.getColumnIndex('year')).to.equal(indexOf(columnNames, 'year'));
  });
  it('getColumn(columnName)', () => {
    expect(dv.getColumn('year')).to.eql(map(populationChina, row => row.year));
  });
  it('getColumnData(columnName)', () => {
    expect(dv.getColumnData('year')).to.eql(map(populationChina, row => row.year));
  });

  // data process
  it('getSubset(startRowIndex, endRowIndex, columnNames)', () => {
    dv.addRow(mockRow);
    const len = dv.rows.length;
    expect(dv.getSubset(len - 1, len - 1, columnNames)).to.eql([ mockRow ]);
  });
  it('toString(prettyPrint)', () => {
    expect(dv.toString()).to.equal(JSON.stringify(populationChina));
    expect(dv.toString(true)).to.equal(JSON.stringify(populationChina, null, 2));
  });

  // loose mode
  it('loose mode', () => {
    expect(() => {
      new View();
      new View({});
    }).to.not.throw();

    const dv = new View()
      .source(populationChina)
      .transform({
        type: 'map',
        callback(row) {
          row.loose = true;
          return row;
        }
      });
    expect(dv.rows[0].loose).to.equal(true);
  });

  it('source', done => {
    const dv = new View();
    dv.source(populationChina);
    dv.on('change', () => {
      expect(!!dv.rows.length).to.equal(true);
      done();
    });
    dv.source(populationChina);
  });
});
