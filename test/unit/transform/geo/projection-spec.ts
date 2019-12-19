import { expect } from 'chai';
import DataSet from '../../../../src';
const { getTransform } = DataSet;
import geoWorld from '../../../fixtures/countries-geo.json';
import { View } from '../../../../src/view';

describe('View.transform(): geo.projection', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getTransform('geo.projection')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'geo.projection',
        projection: 'geoAiry',
        as: ['x', 'y', 'centroidX', 'centroidY'],
      });
    }).to.throw();
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo',
      }).transform({
        type: 'geo.projection',
        as: ['x', 'y', 'centroidX', 'centroidY'],
      });
    }).to.throw();
  });

  it('geo', () => {
    dv.source(geoWorld, {
      type: 'geo',
    }).transform({
      type: 'geo.projection',
      projection: 'geoAiry',
      as: ['x', 'y', 'centroidX', 'centroidY'],
    });
    const features = dv.rows;
    const feature = features[0];
    expect(feature.x).to.exist;
    expect(feature.y).to.exist;
    expect(feature.centroidX).to.exist;
    expect(feature.centroidY).to.exist;
  });
});
