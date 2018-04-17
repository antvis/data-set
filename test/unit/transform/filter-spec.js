const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const populationChina = require('../../fixtures/population-china.json');

describe('View.transform(): filter', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('filter')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'filter'
    });
    expect(dv.rows.length).to.equal(dv.origin.length);
  });

  it('callback', () => {
    dv.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2002'; // origin data range: [2002, 2015]
      }
    });
    expect(dv.rows.length).to.equal(dv.origin.length - 1);
  });

  it('empty condiction', () => {
    dv.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2100'; // origin data range: [2002, 2015]
      }
    });
    expect(dv.rows.length).to.equal(0);
  });
});
