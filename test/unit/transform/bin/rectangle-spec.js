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

describe('DataView.transform(): bin.rectangle', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test').source(data);
  });

  it('api', () => {
    expect(getTransform('bin.rectangle')).to.be.a('function');
    expect(getTransform('bin.rect')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'bin.rectangle',
      fields: [ 'a', 'b' ]
    });
    expect(dataView.rows[0].x).to.eql([ 0, 2, 2, 0 ]);
    expect(dataView.rows[0].y).to.eql([ 0, 0, 2, 2 ]);
    expect(dataView.rows[10].x).to.eql([ 8, 10, 10, 8 ]);
    expect(dataView.rows[10].y).to.eql([ 8, 8, 10, 10 ]);
  });

  it('thresholds', () => {
    dataView.transform({
      type: 'bin.rectangle',
      fields: [ 'a', 'b' ],
      thresholdsX: [ 0, 5, 11 ],
      thresholdsY: [ 0, 5, 11 ]
    });
    expect(dataView.rows[0].x).to.eql(dataView.rows[1].x);
    expect(dataView.rows[0].y).to.eql(dataView.rows[1].y);
    expect(dataView.rows[9].x).to.eql(dataView.rows[10].x);
    expect(dataView.rows[9].y).to.eql(dataView.rows[10].y);
  });

});
