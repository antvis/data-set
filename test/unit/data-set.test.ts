/**
 * @jest-environment jsdom
 */

import { forIn, keys } from 'lodash';
import DataSet from '../../src';

describe('DataSet', () => {
  it('Constructor', () => {
    expect(typeof DataSet).toBe('function');
    expect(typeof new DataSet()).toBe('object');
  });

  it('init with state', () => {
    // init with state
    const ds0 = new DataSet();
    expect(ds0.state).toEqual({});

    const ds1 = new DataSet({
      state: {
        foo: 'bar',
      },
    });
    expect(ds1.state.foo).toEqual('bar');
  });

  it('createView(name)', () => {
    const ds = new DataSet();
    ds.createView('test');
    expect(keys(ds.views).length).toEqual(1);
    ds.createView();
    expect(keys(ds.views).length).toEqual(2);
    expect(() => {
      ds.createView('test');
    }).toThrow();
  });

  it('setView(name, view)', () => {
    const ds = new DataSet();
    const dv = ds.createView('test1');
    ds.setView('test2', dv);
    expect(ds.getView('test2')).toEqual(ds.getView('test1'));
  });

  it('setState(name, value)', () => {
    const ds = new DataSet();
    const newState = {
      foo: 'bar',
      hello: 'world',
      hey: 'jude',
    };
    let count = 0;
    ds.on('statechange', () => {
      count++;
    });
    forIn(newState, (value, key) => {
      ds.setState(key, value);
    });
    expect(ds.state).toEqual(newState);
    expect(count).toEqual(0);
    setTimeout(() => {
      expect(count).toEqual(1);
    }, 16);
  });

  it('setState(name, value): View watching or not watching', () => {
    let emittedCount = 0;
    const ds = new DataSet();
    const dv = ds.createView({
      watchingStates: ['foo'],
    });
    dv.on('change', () => {
      emittedCount++;
    });
    ds.setState('hello', 'world');
    ds.setState('foo', 'bar');
    expect(emittedCount).toEqual(0);
    setTimeout(() => {
      expect(emittedCount).toEqual(1);
    }, 16);
  });
});
