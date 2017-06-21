const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../../index');

describe('DataView.transform(): bin.rectangle', () => {
  const dataSet = new DataSet();
  let dataView;
  let data;

  beforeEach(() => {
    data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        x: i,
        y: i
      });
    }
    dataView = new DataView(dataSet);
    dataView.source(data);
  });

  it('api', () => {
    expect(getTransform('bin.rectangle')).to.be.a('function');
    expect(getTransform('bin.rect')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'bin.rectangle',
      fields: [ 'x', 'y' ],
      as: [ '_x', '_y' ]
    });
  });
});

