const {
  sortBy
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');
const populationChina = require('../../fixtures/population-china.json');
const data = populationChina.concat({
  year: '2001',
  population: '1274530000'
});

describe('View.transform(): sort', () => {
  const ds = new DataSet();
  let dv;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('sort')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort'
    });
    expect(dv.rows).to.eql(data.sort((a, b) => a.year - b.year));
  });

  it('callback', () => {
    dv.transform({
      type: 'sort',
      callback(a, b) {
        return a.year - b.year;
      }
    });
    expect(dv.rows).to.eql(sortBy(data, [ 'year' ]));
  });
});

