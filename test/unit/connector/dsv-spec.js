const expect = require('chai').expect;
const {
  DataSet,
  DataView,
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
    dataView = new DataView(dataSet);
  });

  it('api', () => {
    expect(getConnector('dsv').parse).to.be.a('function');
    expect(getConnector('csv').parse).to.be.a('function');
    expect(getConnector('tsv').parse).to.be.a('function');
  });

  it('dsv', () => {
    dataView.source(source.psv, {
      type: 'dsv',
      delimiter: '|'
    });
    expect(dataView.origin).to.deep.equal(data);
  });

  it('csv', () => {
    dataView.source(source.csv, {
      type: 'csv'
    });
    expect(dataView.origin).to.deep.equal(data);
    dataView.source(source.csv2, {
      type: 'csv'
    });
    expect(dataView.origin).to.deep.equal(data2);
  });

  it('tsv', () => {
    dataView.source(source.tsv, {
      type: 'tsv'
    });
    expect(dataView.origin).to.deep.equal(data);
    dataView.source(source.tsv2, {
      type: 'tsv'
    });
    expect(dataView.origin).to.deep.equal(data2);
  });
});
