const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../src/index');
const topoUS = require('../../fixtures/us-topo.json');

describe('View.source(): topojson', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('topojson')).to.be.a('function');
    expect(getConnector('TopoJSON')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(topoUS, {
        type: 'topojson'
      });
    }).to.throw();

    expect(() => {
      dv.source(topoUS, {
        type: 'topojson',
        object: 'states'
      });
    }).to.not.throw();
  });
});
