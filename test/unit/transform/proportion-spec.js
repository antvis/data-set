const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');

describe('DataView.transform(): proportion', () => {
  const dataSet = new DataSet();
  const data = [
    { x: 0, y: 28 },
    { x: 0, y: 55 },
    { x: 1, y: 43 },
    { x: 1, y: 91 },
    { x: 2, y: 81 },
    { x: 2, y: 53 },
    { x: 3, y: 19 },
    { x: 3, y: 19 },
    { x: 3, y: 19 },
    { x: 3, y: 19 }
  ];
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(data);
  });

  it('api', () => {
    expect(getTransform('proportion')).to.be.a('function');
    expect(() => {
      dataView.transform({
        type: 'proportion'
      });
    }).to.throw();
  });

  it('default', () => {
    dataView.transform({
      type: 'proportion',
      field: 'x'
    });
    expect(dataView.rows.length).to.equal(4);
    expect(dataView.rows[0]).to.eql({
      x: 0,
      '..proportion': 0.2
    });
  });

  it('as', () => {
    dataView.transform({
      type: 'proportion',
      field: 'x',
      as: 'z'
    });
    expect(dataView.rows.length).to.equal(4);
    expect(dataView.rows[0]).to.eql({
      x: 0,
      z: 0.2
    });
  });
});
