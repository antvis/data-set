const {
  map
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const populationChina = require('../../fixtures/population-china.json');

describe('View.transform(): map', () => {
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('map')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'map'
    });
    expect(dv.rows.length).to.equal(populationChina.length);
  });

  it('callback', () => {
    dv.transform({
      type: 'map',
      callback(row) {
        return row.year; // origin data range: [2002, 2015]
      }
    });
    expect(dv.rows).to.eql(map(populationChina, row => row.year));
  });
});
