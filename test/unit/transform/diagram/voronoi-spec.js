const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');

describe('View.transform(): diagram.voronoi', () => {
  const ds = new DataSet();
  let dv;
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('diagram.voronoi')).to.be.a('function');
    expect(getTransform('voronoi')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'diagram.voronoi',
        as: [ '_x', '_y' ]
      });
    }).to.throw();
    expect(() => {
      dv.transform({
        type: 'diagram.voronoi',
        fields: [ 'x', 'y' ],
        as: [ '_x', '_y', 'extra' ]
      });
    }).to.throw();
  });

  it('voronoi', () => {
    dv.transform({
      type: 'diagram.voronoi',
      fields: [ 'x', 'y' ],
      as: [ '_x', '_y' ]
    });
    const rows = dv.rows;
    const firstRow = rows[0];
    expect(firstRow._x).to.be.an('array');
    expect(firstRow._y).to.be.an('array');
    expect(firstRow._x.length).to.equal(firstRow._y.length);
  });
});
