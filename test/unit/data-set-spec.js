const {
  forIn
} = require('lodash');
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

  it('setState(name, value)', () => {
    const dataSet = new DataSet();
    const newState = {
      foo: 'bar',
      hello: 'world',
      hey: 'jude'
    };
    let count = 0;
    dataSet.on('statechange', () => {
      count++;
    });
    forIn(newState, (value, key) => {
      dataSet.setState(key, value);
    });
    expect(dataSet.state).to.not.equal(newState);
    expect(dataSet.state).to.eql(newState);
    expect(count).to.equal(0);
    setTimeout(() => {
      expect(count).to.equal(1);
    }, 16);
  });
});
