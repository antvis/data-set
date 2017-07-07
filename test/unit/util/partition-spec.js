const {
  expect
} = require('chai');
const partition = require('../../../src/util/partition');

const data = [
  { x: 0, y: 28, c: 0 },
  { x: 0, y: 55, c: 1 },
  { x: 1, y: 43, c: 0 }
];

describe('util: partition(rows, groupBy, orderBy)', () => {
  it('api', () => {
    expect(partition).to.be.a('function');
  });

  it('groupBy', () => {
    const groups = partition(data, [ 'c' ], [ 'x' ]);
    expect(groups[0].length).to.equal(2);
    expect(groups[1].length).to.equal(1);
  });
});
