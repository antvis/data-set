const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getConnector
} = require('../../../index');
const topoUS = require('../../fixtures/us-topo.json');

describe('DataView.source(): topojson', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
  });

  it('api', () => {
    expect(getConnector('topojson')).to.be.a('function');
    expect(getConnector('TopoJSON')).to.be.a('function');
  });

  it('topojson', () => {
    dataView.source(topoUS, {
      type: 'topojson',
      object: 'states'
    });
    // console.log(dataView.rows)
  });
});
