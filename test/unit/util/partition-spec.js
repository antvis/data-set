const {
  expect
} = require('chai');
const partition = require('../../../src/util/partition');

const data = [
  { x: 0, y: 28, c: 0 },
  { x: 0, y: 55, c: 1 },
  { x: 1, y: 43, c: 0 }
];

describe('partition', () => {
  it('api', () => {
    expect(partition).to.be.a('function');
  });

  it('groupBy', () => {
    const rows = partition(data, [ 'c' ], [ 'x' ]);
    console.log(rows);
  });
});
