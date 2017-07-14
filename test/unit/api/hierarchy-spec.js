const {
  expect
} = require('chai');
const DataSet = require('../../../index');
const flare = require('../../fixtures/flare.json');

describe('DataView API: hierarchy', () => {
  const dataSet = new DataSet();
  const dataView = dataSet.createView('test').source(flare, {
    type: 'hierarchy'
  });

  it('getAllNodes()', () => {
    expect(dataView.getAllNodes().length).to.equal(252);
  });
  it('getAllLinks()', () => {
    expect(dataView.getAllLinks().length).to.equal(251);
  });

});
