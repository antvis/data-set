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
  getTransform
} = require('../../../src/index');

describe('View.transform(): fold', () => {
  const data = [ // token from vega-dataFlow
    { a: '!', b: 5, c: 7, d: '|' },
    { a: '?', b: 2, c: 4, d: '/' }
  ];
  const row0 = data[0];
  const row1 = data[1];
  const dataKeys = keys(row0);
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('fold')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'fold'
    });
    expect(dv.rows.length).to.equal(8);
    expect(keys(dv.rows[0])).to.eql([
      'key',
      'value'
    ]);
  });

  it('key and value', () => {
    dv.transform({
      type: 'fold',
      key: 'type',
      value: 'typeValue'
    });
    expect(dv.rows.length).to.equal(8);
    expect(keys(dv.rows[0])).to.eql([
      'type',
      'typeValue'
    ]);
  });

  it('empty fields', () => {
    dv.transform({
      type: 'fold',
      fields: []
    });
    expect(dv.rows.length).to.equal(8);
  });

  it('one field', () => {
    const fields = [ 'a' ];
    dv.transform({
      type: 'fold',
      fields
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql(assign({
      key: 'a',
      value: row0.a
    }, pick(row0, difference(dataKeys, fields))));
    expect(dv.rows[1]).to.eql(assign({
      key: 'a',
      value: row1.a
    }, pick(row1, difference(dataKeys, fields))));
  });

  it('multiple fields', () => {
    const fields = [ 'b', 'c' ];
    dv.transform({
      type: 'fold',
      fields
    });
    expect(dv.rows.length).to.equal(4);
    expect(dv.rows[0]).to.eql(assign({
      key: 'b',
      value: row0.b
    }, pick(row0, difference(dataKeys, fields))));
    expect(dv.rows[1]).to.eql(assign({
      key: 'c',
      value: row0.c
    }, pick(row0, difference(dataKeys, fields))));
    expect(dv.rows[2]).to.eql(assign({
      key: 'b',
      value: row1.b
    }, pick(row1, difference(dataKeys, fields))));
    expect(dv.rows[3]).to.eql(assign({
      key: 'c',
      value: row1.c
    }, pick(row1, difference(dataKeys, fields))));
  });

  it('retains', () => {
    const fields = [ 'a' ];
    const retains = [ 'b', 'c' ];
    dv.transform({
      type: 'fold',
      fields,
      retains
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.rows[0]).to.eql(assign({
      key: 'a',
      value: row0.a
    }, pick(row0, retains)));
    expect(dv.rows[1]).to.eql(assign({
      key: 'a',
      value: row1.a
    }, pick(row1, retains)));
  });
});
