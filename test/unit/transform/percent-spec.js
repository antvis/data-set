const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');

describe('DataView.transform(): percent', () => {
  const dataSet = new DataSet();
  const data = [
    { x: 1 },
    { x: 2 },
    { x: 3 },
    { x: 4 }
  ];
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(data);
  });

  it('api', () => {
    expect(getTransform('percent')).to.be.a('function');
    expect(() => {
      dataView.transform({
        type: 'percent'
      });
    }).to.throw();
  });

  it('default', () => {
    dataView.transform({
      type: 'percent',
      field: 'x'
    });
    expect(dataView.rows.length).to.equal(4);
    expect(dataView.rows[0]).to.eql({
      x: 1,
      '..percent': 0.1
    });
  });

  it('as', () => {
    dataView.transform({
      type: 'percent',
      field: 'x',
      as: 'z'
    });
    expect(dataView.rows.length).to.equal(4);
    expect(dataView.rows[0]).to.eql({
      x: 1,
      z: 0.1
    });
  });
});
