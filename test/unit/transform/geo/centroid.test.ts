import { isNumber } from 'lodash';
import DataSet from '../../../../src';
const { getTransform } = DataSet;
import geoWorld from '../../../fixtures/countries-geo.json';
import { View } from '../../../../src/view';

describe('View.transform(): geo.centroid', () => {
  const data = [
    {
      name: 'Afghanistan',
      value: 4,
    },
    {
      name: 'Angola',
      value: 5,
    },
  ];
  const ds = new DataSet();
  let dv: View;
  ds.createView('geo').source(geoWorld, {
    type: 'geo',
  });

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('geo.centroid')).toBe('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'geo.centroid',
      });
    }).toThrow();
    expect(() => {
      dv.transform({
        type: 'geo.centroid',
        geoView: 'geo',
      });
    }).toThrow();
  });

  it('geo.centroid', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoView: 'geo',
    });
    const rows = dv.rows;
    expect(isNumber(rows[0]._centroid_x)).toBe(true);
    expect(isNumber(rows[0]._centroid_y)).toBe(true);
  });

  // projected
  const geoView = ds.getView('geo');
  geoView.transform({
    type: 'geo.projection',
    projection: 'geoAiry',
  });

  it('geo.centroid: on a projected data view', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoView: 'geo',
    });
    const firstRow = dv.rows[0];
    const feature = geoView.geoFeatureByName(firstRow.name);
    expect(firstRow._centroid_x).toEqual(feature._centroid_x);
    expect(firstRow._centroid_y).toEqual(feature._centroid_y);
  });
});
