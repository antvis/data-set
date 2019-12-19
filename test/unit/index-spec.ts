import { expect } from 'chai';
import DataSet from '../../src';

describe('index', () => {
  it('DataSet', () => {
    expect('DataSet').to.be.a('string');
    expect(DataSet).to.be.a('function');
  });
});
