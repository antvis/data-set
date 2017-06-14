const DataSet = require('../../../index');
const expect = require('chai').expect;
const isRenderer = require('is-electron-renderer');
const {
  remote
} = require('electron');
let fs;
let path;
if (isRenderer) {
  fs = remote.require('fs');
  path = remote.require('path');
} else {
  fs = require('fs');
  path = require('path');
}

function readFileSync(pathname) {
  return fs.readFileSync(path.resolve(process.cwd(), pathname), 'utf8');
}

describe('connector: dsv', () => {
  const dsvConnector = DataSet.getConnector('dsv');
  const csvConnector = DataSet.getConnector('csv');
  const tsvConnector = DataSet.getConnector('tsv');

  const data = [
    {
      Hello: '42',
      World: '"fish"'
    }
  ];
  const data2 = [
    {
      Hello: '42',
      World: '"fish"'
    },
    {
      Hello: 'foo',
      World: 'bar'
    }
  ];

  it('api', () => {
    expect(dsvConnector.parse).to.be.a('function');
    expect(csvConnector.parse).to.be.a('function');
    expect(tsvConnector.parse).to.be.a('function');
  });

  it('dsv', () => {
    const psv = readFileSync('./test/fixtures/sample.psv');
    const rows = dsvConnector.parse(psv, {
      delimiter: '|'
    });
    expect(rows).to.be.an('array');
    expect(rows).to.deep.equal(data);
  });

  it('csv', () => {
    const csv = readFileSync('./test/fixtures/sample.csv');
    const rows = csvConnector.parse(csv);
    expect(rows).to.be.an('array');
    expect(rows).to.deep.equal(data);
    const csv2 = readFileSync('./test/fixtures/sample2.csv');
    const rows2 = csvConnector.parse(csv2);
    expect(rows2).to.be.an('array');
    expect(rows2).to.deep.equal(data2);
  });

  it('tsv', () => {
    const csv = readFileSync('./test/fixtures/sample.tsv');
    const rows = tsvConnector.parse(csv);
    expect(rows).to.be.an('array');
    expect(rows).to.deep.equal(data);
    const tsv2 = readFileSync('./test/fixtures/sample2.tsv');
    const rows2 = tsvConnector.parse(tsv2);
    expect(rows2).to.be.an('array');
    expect(rows2).to.deep.equal(data2);
  });

  const DataView = DataSet.DataView;
  it('DataView.source(): dsv', () => {
    const dataSet = new DataSet();
    const dataView = new DataView(dataSet);
    const csv = readFileSync('./test/fixtures/sample.csv');
    dataView.source(csv, {
      type: 'csv'
    });
    expect(dataView.origin).to.deep.equal(data);
  });
});
