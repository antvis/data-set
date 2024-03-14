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
    expect(typeof getConnector('hierarchy')).toBe('function');
    expect(typeof getConnector('tree')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy',
      });
    }).not.toThrow();
  });
});
