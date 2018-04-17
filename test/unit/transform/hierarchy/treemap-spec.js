const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');
const flare = require('../../../fixtures/flare.json');

describe('View.transform(): hierarchy.treemap', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getTransform('hierarchy.treemap')).to.be.a('function');
    expect(getTransform('treemap')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'hierarchy.treemap',
        as: [ 'x', 'y' ]
      });
    }).to.throw();
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy'
      }).transform({
        type: 'hierarchy.treemap',
        as: [ 'x', 'y', 'extra' ]
      });
    }).to.throw();
  });

  it('treemap', () => {
    dv.source(flare, {
      type: 'hierarchy'
    }).transform({
      type: 'hierarchy.treemap',
      as: [ 'x', 'y' ]
    });
    const root = dv.root;
    expect(root.x).to.be.an('array');
    expect(root.y).to.be.an('array');
    expect(root.x.length).to.equal(4);
    expect(root.y.length).to.equal(4);
    // console.log(root)
  });
});
