import DataSet from '../../../src';
const { getConnector } = DataSet;

describe('View.source(): default', () => {
  const ds = new DataSet();
  const testView = ds.createView('test').source([
    {
      foo: 'bar',
    },
  ]);

  it('api', () => {
    expect(typeof getConnector('default')).toBe('function');
  });

  it('View instance', () => {
    const testView2 = ds.createView('test2').source(testView);
    expect(testView2.origin).toEqual(testView.rows);
    expect(testView2.origin === testView.rows).toEqual(false);
  });

  it('string', () => {
    const testView3 = ds.createView('test3').source('test');
    expect(testView3.origin).toEqual(testView.rows);
    expect(testView3.origin === testView.rows).toEqual(false);
  });
});
