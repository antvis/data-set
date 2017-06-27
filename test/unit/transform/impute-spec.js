const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');

describe('DataView.transform(): impute', () => {
  const dataSet = new DataSet();
  const data = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 1, y: 7 },
    { x: 1 },
    { x: 1, y: 9 },
    { x: 2 }
  ];
  // const length = data.length;
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(data);
  });

  it('api', () => {
    expect(getTransform('impute')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.transform({
        type: 'impute'
      });
    }).to.throw();
  });

  it('impute: value', () => {
    dataView.transform({
      field: 'y',
      groupBy: [ 'x' ],
      method: 'value',
      type: 'impute',
      value: 10
    });
    const rows = dataView.rows;
    expect(rows[3].y).to.equal(10);
    expect(rows[7].y).to.equal(10);
    expect(rows[9].y).to.equal(10);
  });

  it('impute: max', () => {
    dataView.transform({
      field: 'y',
      groupBy: [ 'x' ],
      method: 'max',
      type: 'impute'
    });
    const rows = dataView.rows;
    expect(rows[3].y).to.equal(3);
    expect(rows[7].y).to.equal(9);
    expect(rows[9].y).to.equal(9);
  });

  it('impute: not grouping', () => {
    dataView.transform({
      field: 'y',
      method: 'max',
      type: 'impute'
    });
    const rows = dataView.rows;
    expect(rows[3].y).to.equal(9);
    expect(rows[7].y).to.equal(9);
    expect(rows[9].y).to.equal(9);
  });
});
