const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');
const populationChina = require('../../fixtures/population-china.json');

describe('DataView.transform(): filter', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(populationChina);
  });

  it('api', () => {
    expect(getTransform('filter')).to.be.a('function');
  });

  it('default filter', () => {
    dataView.transform({
      type: 'filter'
    });
    expect(dataView.rows.length).to.equal(dataView.origin.length);
  });

  it('filter with condition', () => {
    dataView.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2002'; // origin data range: [2002, 2015]
      }
    });
    expect(dataView.rows.length).to.equal(dataView.origin.length - 1);
  });

  it('filter with condition: empty', () => {
    dataView.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2100'; // origin data range: [2002, 2015]
      }
    });
    expect(dataView.rows.length).to.equal(0);
  });
});
