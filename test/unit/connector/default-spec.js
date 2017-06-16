const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../index');

describe('DataView.source(): default', () => {
  const dataSet = new DataSet();
  const testView = dataSet.createView('test')
    .source([
      {
        foo: 'bar'
      }
    ]);

  it('api', () => {
    expect(getConnector('default')).to.be.a('function');
  });

  it('DataView instance', () => {
    const testView2 = dataSet.createView('test2').source(testView);
    expect(testView2.origin).to.deep.equal(testView.rows);
    expect(testView2.origin === testView.rows).to.be.equal(false);
  });

  it('string', () => {
    const testView3 = dataSet.createView('test3').source('test');
    expect(testView3.origin).to.deep.equal(testView.rows);
    expect(testView3.origin === testView.rows).to.be.equal(false);
  });
});
