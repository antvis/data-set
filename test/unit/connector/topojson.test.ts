import DataSet from '../../../src';
const { getConnector } = DataSet;
import topoUS from '../../fixtures/us-topo.json';
import { View } from '../../../src/view';

describe('View.source(): topojson', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(typeof getConnector('topojson')).toBe('function');
    expect(typeof getConnector('TopoJSON')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      // @ts-ignore
      dv.source(topoUS, { type: 'topojson' });
    }).toThrow();

    expect(() => {
      dv.source(topoUS, {
        type: 'topojson',
        object: 'states',
      });
    }).not.toThrow();
  });
});
