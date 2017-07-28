const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../index');

describe('DataView.source(): default', () => {
  const ds = new DataSet();
  const testView = ds.createView('test').source([
    {
      foo: 'bar'
    }
  ]);

  it('api', () => {
    expect(getConnector('default')).to.be.a('function');
  });

  it('DataView instance', () => {
    const testView2 = ds.createView('test2').source(testView);
    expect(testView2.origin).to.eql(testView.rows);
    expect(testView2.origin === testView.rows).to.equal(false);
  });

  it('string', () => {
    const testView3 = ds.createView('test3').source('test');
    expect(testView3.origin).to.eql(testView.rows);
    expect(testView3.origin === testView.rows).to.equal(false);
  });
});
