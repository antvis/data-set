const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../index');
const topoUS = require('../../fixtures/us-topo.json');

describe('DataView.source(): topojson', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test');
  });

  it('api', () => {
    expect(getConnector('topojson')).to.be.a('function');
    expect(getConnector('TopoJSON')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.source(topoUS, {
        type: 'topojson'
      });
    }).to.throw();

    expect(() => {
      dataView.source(topoUS, {
        type: 'topojson',
        object: 'states'
      });
    }).to.not.throw();
  });
});
