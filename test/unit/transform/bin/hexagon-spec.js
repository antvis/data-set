const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');

const data = [];
for (let i = 0; i <= 10; i++) {
  data.push({
    a: i,
    b: i
  });
}

describe('DataView.transform(): bin.hexagon', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(data);
  });

  it('api', () => {
    expect(getTransform('bin.hexagon')).to.be.a('function');
    expect(getTransform('bin.hex')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'bin.hexagon',
      fields: [ 'a', 'b' ]
    });
    expect(dataView.rows[0].x.length).to.equal(6);
    expect(dataView.rows[0].y.length).to.equal(6);
  });

  it('radius', () => {
    dataView.transform({
      type: 'bin.hexagon',
      fields: [ 'a', 'b' ],
      radius: 10
    });
    expect(dataView.rows[0].x).to.eql(dataView.rows[1].x);
    expect(dataView.rows[9].x).to.eql(dataView.rows[10].x);
  });

  // it('extent', () => {
  //   dataView.transform({
  //     type: 'bin.hexagon',
  //     fields: [ 'a', 'b' ],
  //     extent: [[-10, -10], [10, 10]]
  //   });
  // });
});
