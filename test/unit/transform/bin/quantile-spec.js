const {
  clone,
  groupBy,
  keys
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../../index');

const data = [];
for (let i = 0; i <= 100; i++) {
  data.push({
    x: i,
    y: i * 10
  });
}

describe('DataView.transform(): bin.quantile', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(clone(data));
  });

  it('api', () => {
    expect(getTransform('bin.quantile')).to.be.a('function');
    expect(() => {
      dataView.transform({
        type: 'bin.quantile'
      });
    }).to.throw();
  });

  it('fields', () => {
    dataView.transform({
      type: 'bin.quantile',
      fields: [ 'x', 'y' ]
    });
    const rows = dataView.rows;
    expect(rows[0]._x).to.equal(5);
    expect(rows[0]._y.length).to.equal(5);
  });

  it('as', () => {
    dataView.transform({
      type: 'bin.quantile',
      fields: [ 'x', 'y' ],
      as: [ 'a', 'b' ]
    });
    const rows = dataView.rows;
    expect(rows[0].a).to.equal(5);
    expect(rows[0].b.length).to.equal(5);
    expect(keys(groupBy(rows, row => {
      return row.a;
    })).length).to.equal(10);
  });
});
