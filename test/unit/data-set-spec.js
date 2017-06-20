const {
  expect
} = require('chai');
const DataSet = require('../../src/data-set');

describe('DataSet', () => {
  it('Constructor', () => {
    expect(DataSet).to.be.a('function');
    expect(new DataSet()).to.be.an('object');
  });

  it('setView(name, view)', () => {
    const dataSet = new DataSet();
    const dataView = dataSet.createView('test1');
    dataSet.setView('test2', dataView);
    expect(dataSet.getView('test2')).to.equal(dataSet.getView('test1'));
  });
});
