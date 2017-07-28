const {
  sortBy
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');

describe('DataView.transform(): sort', () => {
  const ds = new DataSet();
  let dv;
  let populationChina;

  beforeEach(() => {
    populationChina = require('../../fixtures/population-china.json');
    populationChina.push({
      year: '2001',
      population: '1274530000'
    });
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('sort')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort'
    });
    expect(dv.rows).to.eql(populationChina.sort((a, b) => a.year - b.year));
  });

  it('callback', () => {
    dv.transform({
      type: 'sort',
      callback(a, b) {
        return a.year - b.year;
      }
    });
    expect(dv.rows).to.eql(sortBy(populationChina, [ 'year' ]));
  });
});

