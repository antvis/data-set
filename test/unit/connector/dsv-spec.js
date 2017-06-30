const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../index');
const {
  readFileSync
} = require('../../support/util');

const data = require('../../fixtures/sample.json');
const data2 = require('../../fixtures/sample2.json');

const source = {
  psv: readFileSync('./test/fixtures/sample.psv'),
  csv: readFileSync('./test/fixtures/sample.csv'),
  csv2: readFileSync('./test/fixtures/sample2.csv'),
  tsv: readFileSync('./test/fixtures/sample.tsv'),
  tsv2: readFileSync('./test/fixtures/sample2.tsv')
};

describe('DataView.source(): dsv', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test');
  });

  it('api', () => {
    expect(getConnector('dsv')).to.be.a('function');
    expect(getConnector('csv')).to.be.a('function');
    expect(getConnector('tsv')).to.be.a('function');
  });

  it('dsv', () => {
    dataView.source(source.psv, {
      type: 'dsv',
      delimiter: '|'
    });
    expect(dataView.origin).to.eql(data);
  });

  it('csv', () => {
    dataView.source(source.csv, {
      type: 'csv'
    });
    expect(dataView.origin).to.eql(data);
    dataView.source(source.csv2, {
      type: 'csv'
    });
    expect(dataView.origin).to.eql(data2);
  });

  it('tsv', () => {
    dataView.source(source.tsv, {
      type: 'tsv'
    });
    expect(dataView.origin).to.eql(data);
    dataView.source(source.tsv2, {
      type: 'tsv'
    });
    expect(dataView.origin).to.eql(data2);
  });
});
