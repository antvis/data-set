import DataSet from '../../../src';
import { View } from '../../../src/view';
import { renameTransform } from '../../../src/transform/rename';
const { getTransform } = DataSet;

describe('View.transform(): rename', () => {
  DataSet.registerTransform('rename', renameTransform);
  DataSet.registerTransform('rename-fields', renameTransform);

  const data = [{ a: 1, b: 2 }];
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('rename')).toBe('function');
    expect(typeof getTransform('rename-fields')).toBe('function');
    expect(getTransform('rename-fields')).toEqual(getTransform('rename'));
  });

  it('default', () => {
    dv.transform({
      type: 'rename',
    });
    expect(dv.rows).toEqual(data);
  });

  it('map', () => {
    dv.transform({
      type: 'rename',
      map: {
        a: 'c',
      },
    });
    expect(dv.rows).toEqual([{ c: 1, b: 2 }]);
  });
});
