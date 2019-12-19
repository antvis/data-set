import { expect } from 'chai';
import DataSet from '../../../src';
const { getConnector } = DataSet;
import geoWorld from '../../fixtures/countries-geo.json';
import { View } from '../../../src/view';

describe('View.source(): geojson', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('geo')).to.be.a('function');
    expect(getConnector('geojson')).to.be.a('function');
    expect(getConnector('GeoJSON')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo',
      });
    }).to.not.throw();
  });
});
