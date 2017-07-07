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
const DataView = require('../../src/data-view');
const populationChina = require('../fixtures/population-china.json');

const mockRow = {
  year: '2016',
  population: '1384530000'
};
const columnNames = keys(populationChina[0]);

describe('DataView', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(populationChina);
  });

  // constructor
  it('Constructor', () => {
    expect(DataView).to.be.a('function');
    expect(dataView).to.be.an('object');
    expect(() => { new DataView(); }).to.throw();
  });

  // rows
  it('addRow(row)', () => {
    dataView.addRow(mockRow);
    expect(dataView.rows.length).to.equal(dataView.origin.length + 1);
  });
  it('removeRow(index)', () => {
    dataView.removeRow(0);
    expect(dataView.rows.length).to.equal(dataView.origin.length - 1);
  });
  it('updateRow(index, newRow)', () => {
    dataView.updateRow(0, mockRow);
    expect(dataView.rows[0]).to.eql(mockRow);
  });
  it('findRows(query)', () => {
    dataView.addRow(mockRow);
    const rows = dataView.findRows({
      year: '2016'
    });
    expect(rows[0]).to.equal(mockRow);
    const rows2 = dataView.findRows({
      year: '2020'
    });
    expect(rows2.length).to.equal(0);
  });
  it('findRow(query)', () => {
    dataView.addRow(mockRow);
    const row = dataView.findRow({
      year: '2016'
    });
    expect(row).to.equal(mockRow);
    const row2 = dataView.findRow({
      year: '2020'
    });
    expect(isNil(row2)).to.be.true;
  });

  // columns
  it('getColumnNames()', () => {
    expect(dataView.getColumnNames()).to.eql(columnNames);
  });
  it('getColumnName(index)', () => {
    expect(dataView.getColumnName(0)).to.equal(columnNames[0]);
  });
  it('getColumnIndex(columnName)', () => {
    expect(dataView.getColumnIndex('year')).to.equal(indexOf(columnNames, 'year'));
  });
  it('getColumn(columnName)', () => {
    expect(dataView.getColumn('year')).to.eql(map(populationChina, row => row.year));
  });
  it('getColumnData(columnName)', () => {
    expect(dataView.getColumnData('year')).to.eql(map(populationChina, row => row.year));
  });

  // data process
  it('getSubset(startRowIndex, endRowIndex, columnNames)', () => {
    dataView.addRow(mockRow);
    const len = dataView.rows.length;
    expect(dataView.getSubset(len - 1, len - 1, columnNames)).to.eql([ mockRow ]);
  });
  it('toString(prettyPrint)', () => {
    expect(dataView.toString()).to.equal(JSON.stringify(populationChina));
    expect(dataView.toString(true)).to.equal(JSON.stringify(populationChina, null, 2));
  });
});
