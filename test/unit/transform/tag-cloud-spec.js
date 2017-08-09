const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../index');

describe('DataView.transform(): tag-cloud', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView().source([
      'Hello', 'world', 'normally',
      'you', 'want', 'more', 'words',
      'than', 'this'
    ].map(d => {
      return {
        text: d,
        value: 10 + Math.random() * 90,
        test: 'haha'
      };
    }));
  });

  it('api', () => {
    expect(getTransform('tag-cloud')).to.be.a('function');
    expect(getTransform('word-cloud')).to.be.a('function');
    expect(getTransform('word-cloud') === getTransform('tag-cloud')).to.equal(true);
  });

  it('default', () => {
    dv.transform({
      type: 'tag-cloud'
    });
  });
});
