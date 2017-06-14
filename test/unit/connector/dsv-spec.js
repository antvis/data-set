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

const source = {
  psv: readFileSync('./test/fixtures/sample.psv'),
  csv: readFileSync('./test/fixtures/sample.csv'),
  csv2: readFileSync('./test/fixtures/sample2.csv'),
  tsv: readFileSync('./test/fixtures/sample.tsv'),
  tsv2: readFileSync('./test/fixtures/sample2.tsv')
};
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

describe('connector: dsv', () => {
  const dsvConnector = DataSet.getConnector('dsv');
  const csvConnector = DataSet.getConnector('csv');
  const tsvConnector = DataSet.getConnector('tsv');
  it('api', () => {
    expect(dsvConnector.parse).to.be.a('function');
    expect(csvConnector.parse).to.be.a('function');
    expect(tsvConnector.parse).to.be.a('function');
  });

  it('dsv', () => {
    const rows = dsvConnector.parse(source.psv, {
      delimiter: '|'
    });
    expect(rows).to.be.an('array');
    expect(rows).to.deep.equal(data);
  });

  it('csv', () => {
    const rows = csvConnector.parse(source.csv);
    expect(rows).to.be.an('array');
    expect(rows).to.deep.equal(data);
    const rows2 = csvConnector.parse(source.csv2);
    expect(rows2).to.be.an('array');
    expect(rows2).to.deep.equal(data2);
  });

  it('tsv', () => {
    const rows = tsvConnector.parse(source.tsv);
    expect(rows).to.be.an('array');
    expect(rows).to.deep.equal(data);
    const rows2 = tsvConnector.parse(source.tsv2);
    expect(rows2).to.be.an('array');
    expect(rows2).to.deep.equal(data2);
  });
});

describe('DataView.source(): dsv', () => {
  const dataSet = new DataSet();
  const DataView = DataSet.DataView;
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
  });

  it('dsv', () => {
    dataView.source(source.psv, {
      type: 'dsv',
      delimiter: '|'
    });
    console.log(dataView.origin);
    expect(dataView.origin).to.deep.equal(data);
  });

  it('csv', () => {
    dataView.source(source.csv, {
      type: 'csv'
    });
    expect(dataView.origin).to.deep.equal(data);
  });

  it('tsv', () => {
    dataView.source(source.tsv, {
      type: 'tsv'
    });
    expect(dataView.origin).to.deep.equal(data);
  });
});
