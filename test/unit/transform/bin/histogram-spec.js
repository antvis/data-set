const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../../index');

describe('DataView.transform(): bin.histogram', () => {
  const dataSet = new DataSet();
  let dataView;
  let populationChina;

  beforeEach(() => {
    populationChina = require('../../../fixtures/population-china.json');
    dataView = new DataView(dataSet);
    dataView.source(populationChina)
      .transform({
        type: 'map',
        callback(row) {
          row.year = parseInt(row.year, 10);
          return row;
        }
      });
  });

  it('api', () => {
    expect(getTransform('bin.histogram')).to.be.a('function');
    expect(getTransform('bin.dot')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'bin.histogram',
      field: 'year'
    });
  });
});

