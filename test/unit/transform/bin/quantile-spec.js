const {
  clone
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../../index');

const data = [
  { x: 1, y: 1, z: 1 },
  { x: 2, y: 1, z: 2 },
  { x: 3, y: 1, z: 3 },
  { x: 4, y: 1, z: 4 },
  { x: 1, y: 2, z: 5 },
  { x: 2, y: 2, z: 6 },
  { x: 3, y: 2, z: 7 },
  { x: 4, y: 2, z: 8 }
];

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
      field: 'z'
    });
    const rows = dataView.rows;
    expect(rows[0]._bin.length).to.equal(5);
  });

  it('as', () => {
    dataView.transform({
      type: 'bin.quantile',
      field: 'z',
      as: '_z'
    });
    const rows = dataView.rows;
    expect(rows[0]._z.length).to.equal(5);
  });

  it('grouBy', () => {
    dataView.transform({
      type: 'bin.quantile',
      field: 'z',
      groupBy: [ 'x' ],
      as: '_z'
    });
    const rows = dataView.rows;
    expect(rows.length).to.equal(4);
    expect(rows[0]._z.length).to.equal(5);
  });
});
