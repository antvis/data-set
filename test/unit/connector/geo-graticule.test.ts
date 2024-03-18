import DataSet from '../../../src';
import { View } from '../../../src/view';
const { getConnector } = DataSet;

describe('View.source(): geo-graticule', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(typeof getConnector('geo-graticule')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.source({
        type: 'geo-graticule',
      });
    }).not.toThrow();
  });
});
