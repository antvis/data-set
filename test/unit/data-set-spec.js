const {
  forIn,
  keys
} = require('lodash');
const {
  expect
} = require('chai');
const DataSet = require('../../src/data-set');

describe('DataSet', () => {
  it('Constructor', () => {
    expect(DataSet).to.be.a('function');
    expect(new DataSet()).to.be.an('object');
  });

  it('init with state', () => {
    // init with state
    const ds0 = new DataSet();
    expect(ds0.state).to.eql({});

    const ds1 = new DataSet({
      state: {
        foo: 'bar'
      }
    });
    expect(ds1.state.foo).to.equal('bar');
  });

  it('createView(name)', () => {
    const ds = new DataSet();
    ds.createView('test');
    expect(keys(ds.views).length).to.equal(1);
    ds.createView();
    expect(keys(ds.views).length).to.equal(2);
    expect(() => { ds.createView('test'); }).to.throw();
  });

  it('setView(name, view)', () => {
    const ds = new DataSet();
    const dv = ds.createView('test1');
    ds.setView('test2', dv);
    expect(ds.getView('test2')).to.equal(ds.getView('test1'));
  });

  it('setState(name, value)', () => {
    const ds = new DataSet();
    const newState = {
      foo: 'bar',
      hello: 'world',
      hey: 'jude'
    };
    let count = 0;
    ds.on('statechange', () => {
      count++;
    });
    forIn(newState, (value, key) => {
      ds.setState(key, value);
    });
    expect(ds.state).to.not.equal(newState);
    expect(ds.state).to.eql(newState);
    expect(count).to.equal(0);
    setTimeout(() => {
      expect(count).to.equal(1);
    }, 16);
  });

  it('setState(name, value): View watching or not watching', () => {
    let emittedCount = 0;
    const ds = new DataSet();
    const dv = ds.createView({
      watchingStates: [
        'foo'
      ]
    });
    dv.on('change', () => {
      emittedCount++;
    });
    ds.setState('hello', 'world');
    ds.setState('foo', 'bar');
    expect(emittedCount).to.equal(0);
    setTimeout(() => {
      expect(emittedCount).to.equal(1);
    }, 16);
  });
});
