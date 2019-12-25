import { expect } from 'chai';
import DataSet from '../../../src';
const { getConnector } = DataSet;
import readFileSync from '../../support/util';
import data from '../../fixtures/sample.json';
import data2 from '../../fixtures/sample2.json';
import { View } from '../../../src/view';

describe('View.source(): dsv', () => {
  const source = {
    psv: readFileSync('./test/fixtures/sample.psv'),
    csv: readFileSync('./test/fixtures/sample.csv'),
    csv2: readFileSync('./test/fixtures/sample2.csv'),
    tsv: readFileSync('./test/fixtures/sample.tsv'),
    tsv2: readFileSync('./test/fixtures/sample2.tsv'),
  };
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('dsv')).to.be.a('function');
    expect(getConnector('csv')).to.be.a('function');
    expect(getConnector('tsv')).to.be.a('function');
  });

  it('dsv', () => {
    dv.source(source.psv, {
      type: 'dsv',
      delimiter: '|',
    });
    expect(dv.origin).to.eql(data);
  });

  it('csv', () => {
    dv.source(source.csv, {
      type: 'csv',
    });
    expect(dv.origin).to.eql(data);
    dv.source(source.csv2, {
      type: 'csv',
    });
    expect(dv.origin).to.eql(data2);
  });

  it('tsv', () => {
    dv.source(source.tsv, {
      type: 'tsv',
    });
    expect(dv.origin).to.eql(data);
    dv.source(source.tsv2, {
      type: 'tsv',
    });
    expect(dv.origin).to.eql(data2);
  });
});
