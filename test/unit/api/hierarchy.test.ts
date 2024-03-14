import DataSet from '../../../src';
import flare from '../../fixtures/flare.json';

describe('View API: hierarchy', () => {
  const dv = new DataSet().createView('test').source(flare, {
    type: 'hierarchy',
  });
  dv.transform({
    type: 'hierarchy.indented',
  });

  it('getAllNodes()', () => {
    expect(dv.getAllNodes().length).toEqual(252);
  });
  it('getAllLinks()', () => {
    expect(dv.getAllLinks().length).toEqual(251);
  });
});
