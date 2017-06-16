const {
  sortBy
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../index');

describe('DataView.transform(): sort', () => {
  const dataSet = new DataSet();
  let dataView;
  let populationChina;

  beforeEach(() => {
    populationChina = require('../../fixtures/population-china.json');
    populationChina.push({
      year: '2001',
      population: '1274530000'
    });
    dataView = new DataView(dataSet);
    dataView.source(populationChina);
  });

  it('api', () => {
    expect(getTransform('sort')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'sort'
    });
    expect(dataView.rows).to.be.deep.equal(populationChina.sort((a, b) => a.year - b.year));
  });

  it('sort-by', () => {
    dataView.transform({
      type: 'sort',
      callback(a, b) {
        return a.year - b.year;
      }
    });
    expect(dataView.rows).to.be.deep.equal(sortBy(populationChina, [ 'year' ]));
  });
});

