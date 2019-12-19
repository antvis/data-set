import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';

describe('View.transform(): subset', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('subset')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'subset',
    });
    expect(dv.rows).to.eql(populationChina);
  });

  it('only specify endRowIndex', () => {
    dv.transform({
      type: 'subset',
      endRowIndex: 2,
    });
    expect(dv.rows.length).to.equal(3);
    expect(dv.getColumnNames().length).to.equal(2);
  });

  it('only specify startRowIndex', () => {
    dv.transform({
      type: 'subset',
      startRowIndex: 1,
    });
    expect(dv.rows.length).to.equal(populationChina.length - 1);
    expect(dv.getColumnNames().length).to.equal(2);
  });

  it('only specify columns', () => {
    dv.transform({
      type: 'subset',
      fields: ['year'],
    });
    expect(dv.rows.length).to.equal(populationChina.length);
    expect(dv.getColumnNames().length).to.equal(1);
  });

  it('specify all options', () => {
    dv.transform({
      type: 'subset',
      startRowIndex: 1,
      endRowIndex: 2,
      fields: ['year'],
    });
    expect(dv.rows.length).to.equal(2);
    expect(dv.getColumnNames().length).to.equal(1);
  });
});
