const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');
const flare = require('../../../fixtures/flare.json');

describe('DataView.transform(): hierarchy.treemap', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test');
  });

  it('api', () => {
    expect(getTransform('hierarchy.treemap')).to.be.a('function');
    expect(getTransform('treemap')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.transform({
        type: 'hierarchy.treemap',
        as: [ 'x', 'y' ]
      });
    }).to.throw();
    expect(() => {
      dataView.source(flare, {
        type: 'hierarchy'
      }).transform({
        type: 'hierarchy.treemap',
        as: [ 'x', 'y', 'extra' ]
      });
    }).to.throw();
  });

  it('treemap', () => {
    dataView.source(flare, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.treemap',
      as: [ 'x', 'y' ]
    });
    const root = dataView.root;
    expect(root.x).to.be.an('array');
    expect(root.y).to.be.an('array');
    expect(root.x.length).to.equal(4);
    expect(root.y.length).to.equal(4);
    // console.log(root)
  });
});
