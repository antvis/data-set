const {
  expect
} = require('chai');
const DataSet = require('../../../src/index');
const flare = require('../../fixtures/flare.json');

describe('View API: hierarchy', () => {
  const dv = new DataSet().createView('test').source(flare, {
    type: 'hierarchy'
  });
  dv.transform({
    type: 'hierarchy.indented'
  });

  it('getAllNodes()', () => {
    expect(dv.getAllNodes().length).to.equal(252);
  });
  it('getAllLinks()', () => {
    expect(dv.getAllLinks().length).to.equal(251);
  });

});
