const {
  assign,
  difference,
  keys,
  pick
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');

describe('DataView.transform(): fold', () => {
  const data = [ // token from vega-dataFlow
    { a: '!', b: 5, c: 7, d: '|' },
    { a: '?', b: 2, c: 4, d: '/' }
  ];
  const row0 = data[0];
  const row1 = data[1];
  const dataKeys = keys(row0);
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(data);
  });

  it('api', () => {
    expect(getTransform('fold')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'fold'
    });
    expect(dataView.rows.length).to.equal(8);
    expect(keys(dataView.rows[0])).to.eql([
      'key',
      'value'
    ]);
  });

  it('key and value', () => {
    dataView.transform({
      type: 'fold',
      key: 'type',
      value: 'typeValue'
    });
    expect(dataView.rows.length).to.equal(8);
    expect(keys(dataView.rows[0])).to.eql([
      'type',
      'typeValue'
    ]);
  });

  it('empty fields', () => {
    dataView.transform({
      type: 'fold',
      fields: []
    });
    expect(dataView.rows.length).to.equal(8);
  });

  it('one field', () => {
    const fields = [ 'a' ];
    dataView.transform({
      type: 'fold',
      fields
    });
    expect(dataView.rows.length).to.equal(2);
    expect(dataView.rows[0]).to.eql(assign({
      key: 'a',
      value: row0.a
    }, pick(row0, difference(dataKeys, fields))));
    expect(dataView.rows[1]).to.eql(assign({
      key: 'a',
      value: row1.a
    }, pick(row1, difference(dataKeys, fields))));
  });

  it('multiple fields', () => {
    const fields = [ 'b', 'c' ];
    dataView.transform({
      type: 'fold',
      fields
    });
    expect(dataView.rows.length).to.equal(4);
    expect(dataView.rows[0]).to.eql(assign({
      key: 'b',
      value: row0.b
    }, pick(row0, difference(dataKeys, fields))));
    expect(dataView.rows[1]).to.eql(assign({
      key: 'c',
      value: row0.c
    }, pick(row0, difference(dataKeys, fields))));
    expect(dataView.rows[2]).to.eql(assign({
      key: 'b',
      value: row1.b
    }, pick(row1, difference(dataKeys, fields))));
    expect(dataView.rows[3]).to.eql(assign({
      key: 'c',
      value: row1.c
    }, pick(row1, difference(dataKeys, fields))));
  });

  it('retains', () => {
    const fields = [ 'a' ];
    const retains = [ 'b', 'c' ];
    dataView.transform({
      type: 'fold',
      fields,
      retains
    });
    expect(dataView.rows.length).to.equal(2);
    expect(dataView.rows[0]).to.eql(assign({
      key: 'a',
      value: row0.a
    }, pick(row0, retains)));
    expect(dataView.rows[1]).to.eql(assign({
      key: 'a',
      value: row1.a
    }, pick(row1, retains)));
  });
});
