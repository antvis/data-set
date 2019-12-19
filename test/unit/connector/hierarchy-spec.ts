import { expect } from 'chai';
import DataSet from '../../../src';
const { getConnector } = DataSet;
import flare from '../../fixtures/flare.json';
import { View } from '../../../src/view';

describe('View.source(): hierarchy', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('hierarchy')).to.be.a('function');
    expect(getConnector('tree')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy',
      });
    }).to.not.throw();
  });
});
