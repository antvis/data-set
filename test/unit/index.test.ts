/**
 * @jest-environment jsdom
 */

import DataSet from '../../src';

describe('index', () => {
  it('DataSet', () => {
    expect(typeof 'DataSet').toBe('string');
    expect(typeof DataSet).toBe('function');
  });
});
