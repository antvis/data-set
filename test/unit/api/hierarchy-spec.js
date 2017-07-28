const {
  expect
} = require('chai');
const DataSet = require('../../../index');
const flare = require('../../fixtures/flare.json');

describe('DataView API: hierarchy', () => {
  const dv = new DataSet().createView('test').source(flare, {
    type: 'hierarchy'
  });

  it('getAllNodes()', () => {
    expect(dv.getAllNodes().length).to.equal(252);
  });
  it('getAllLinks()', () => {
    expect(dv.getAllLinks().length).to.equal(251);
  });

});
