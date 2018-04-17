const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../src/index');

describe('View.transform(): tag-cloud', () => {
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
    const firstRow = dv.rows[0];
    // expect(dv.rows.length).to.equal(dv.origin.length);
    expect(firstRow.hasText).to.equal(true);
    expect(firstRow.x).to.be.a('number');
    expect(firstRow.y).to.be.a('number');
    expect(firstRow.text).to.be.a('string');
    expect(firstRow.size).to.be.a('number');
    expect(firstRow.font).to.be.a('string');
  });
});
