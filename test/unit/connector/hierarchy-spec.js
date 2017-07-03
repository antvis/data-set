const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../index');
const flare = require('../../fixtures/flare.json');

describe('DataView.source(): hierarchy', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test');
  });

  it('api', () => {
    expect(getConnector('hierarchy')).to.be.a('function');
    expect(getConnector('tree')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.source(flare, {
        type: 'geo'
      });
    }).to.not.throw();
  });
});
