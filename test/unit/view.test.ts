import { indexOf, isNil, keys, map } from 'lodash';
import DataSet from '../../src';
import populationChina from '../fixtures/population-china.json';
import { View } from '../../src/view';

describe('View', () => {
  const mockRow = {
    year: '2016',
    population: '1384530000',
  };
  const columnNames = keys(populationChina[0]);

  let dv: View;
  beforeEach(() => {
    dv = new DataSet().createView().source(populationChina);
  });

  // constructor
  it('Constructor', () => {
    expect(typeof DataSet.View).toBe('function');
    expect(typeof dv).toBe('object');
  });

  // rows
  it('addRow(row)', () => {
    dv.addRow(mockRow);
    expect(dv.rows.length).toEqual(dv.origin.length + 1);
  });
  it('removeRow(index)', () => {
    dv.removeRow(0);
    expect(dv.rows.length).toEqual(dv.origin.length - 1);
  });
  it('updateRow(index, newRow)', () => {
    dv.updateRow(0, mockRow);
    expect(dv.rows[0]).toEqual(mockRow);
  });
  it('findRows(query)', () => {
    dv.addRow(mockRow);
    const rows = dv.findRows({
      year: '2016',
    });
    expect(rows[0]).toEqual(mockRow);
    const rows2 = dv.findRows({
      year: '2020',
    });
    expect(rows2.length).toEqual(0);
  });
  it('findRow(query)', () => {
    dv.addRow(mockRow);
    const row = dv.findRow({
      year: '2016',
    });
    expect(row).toEqual(mockRow);
    const row2 = dv.findRow({
      year: '2020',
    });
    expect(isNil(row2)).toBe(true);
  });

  // columns
  it('getColumnNames()', () => {
    expect(dv.getColumnNames()).toEqual(columnNames);
  });
  it('getColumnName(index)', () => {
    expect(dv.getColumnName(0)).toEqual(columnNames[0]);
  });
  it('getColumnIndex(columnName)', () => {
    expect(dv.getColumnIndex('year')).toEqual(indexOf(columnNames, 'year'));
  });
  it('getColumn(columnName)', () => {
    expect(dv.getColumn('year')).toEqual(map(populationChina, (row) => row.year));
  });
  it('getColumnData(columnName)', () => {
    expect(dv.getColumnData('year')).toEqual(map(populationChina, (row) => row.year));
  });

  // data process
  it('getSubset(startRowIndex, endRowIndex, columnNames)', () => {
    dv.addRow(mockRow);
    const len = dv.rows.length;
    expect(dv.getSubset(len - 1, len - 1, columnNames)).toEqual([mockRow]);
  });
  it('toString(prettyPrint)', () => {
    expect(dv.toString()).toEqual(JSON.stringify(populationChina));
    expect(dv.toString(true)).toEqual(JSON.stringify(populationChina, null, 2));
  });

  // loose mode
  it('loose mode', () => {
    expect(() => {
      new DataSet.View();
      new DataSet.View({});
    }).not.toThrow();

    const dv = new DataSet.View().source(populationChina).transform({
      type: 'map',
      callback(row) {
        row.loose = true;
        return row;
      },
    });
    expect(dv.rows[0].loose).toEqual(true);
  });

  it('source', (done) => {
    const dv = new DataSet.View();
    dv.source(populationChina);
    dv.on('change', () => {
      expect(!!dv.rows.length).toEqual(true);
      done();
    });
    dv.source(populationChina);
  });
});
