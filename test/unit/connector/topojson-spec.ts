import { expect } from 'chai';
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
    expect(getConnector('topojson')).to.be.a('function');
    expect(getConnector('TopoJSON')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      // @ts-ignore
      dv.source(topoUS, { type: 'topojson' });
    }).to.throw();

    expect(() => {
      dv.source(topoUS, {
        type: 'topojson',
        object: 'states',
      });
    }).to.not.throw();
  });
});
