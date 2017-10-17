const _ = require('lodash');
const {
  expect
} = require('chai');
const kernel = require('../../../src/util/kernel');

describe('util: kernel functions', () => {
  const u0 = 0;
  const u1 = 1;
  const u1_2 = 1 / 2;
  const u2 = 2;

  it('api', () => {
    expect(_.keys(kernel)).to.eql([
      'boxcar',
      'cosine',
      'epanechnikov',
      'gaussian',
      'quartic',
      'triangular',
      'tricube',
      'triweight',
      'uniform'
    ]);
  });

  const uniform = kernel.boxcar;
  it('kernel.uniform(u)', () => {
    expect(uniform).to.be.a('function');
    expect(uniform(u0)).to.equal(0.5);
    expect(uniform(u1)).to.equal(0.5);
    expect(uniform(u1_2)).to.equal(0.5);
    expect(uniform(u2)).to.equal(0);
  });

  const cosine = kernel.cosine;
  it('kernel.cosine(u)', () => {
    expect(cosine).to.be.a('function');
    expect(cosine(u0)).not.to.equal(0);
    expect(cosine(u1)).not.to.equal(0);
    expect(cosine(u1_2)).not.to.equal(0);
    expect(cosine(u2)).to.equal(0);
  });

  const epanechnikov = kernel.epanechnikov;
  it('kernel.epanechnikov(u)', () => {
    expect(epanechnikov).to.be.a('function');
    expect(epanechnikov(u0)).not.to.equal(0);
    expect(epanechnikov(u1)).to.equal(0);
    expect(epanechnikov(u1_2)).not.to.equal(0);
    expect(epanechnikov(u2)).to.equal(0);
  });

  const gaussian = kernel.gaussian;
  it('kernel.gaussian(u)', () => {
    expect(gaussian).to.be.a('function');
    expect(gaussian(u0)).not.to.equal(0);
    expect(gaussian(u1)).not.to.equal(0);
    expect(gaussian(u1_2)).not.to.equal(0);
    expect(gaussian(u2)).not.to.equal(0);
  });

  const quartic = kernel.quartic;
  it('kernel.quartic(u)', () => {
    expect(quartic).to.be.a('function');
    expect(quartic(u0)).not.to.equal(0);
    expect(quartic(u1)).to.equal(0);
    expect(quartic(u1_2)).not.to.equal(0);
    expect(quartic(u2)).to.equal(0);
  });

  const triangular = kernel.triangular;
  it('kernel.triangular(u)', () => {
    expect(triangular).to.be.a('function');
    expect(triangular(u0)).not.to.equal(0);
    expect(triangular(u1)).to.equal(0);
    expect(triangular(u1_2)).not.to.equal(0);
    expect(triangular(u2)).to.equal(0);
  });

  const tricube = kernel.tricube;
  it('kernel.tricube(u)', () => {
    expect(tricube).to.be.a('function');
    expect(tricube(u0)).not.to.equal(0);
    expect(tricube(u1)).to.equal(0);
    expect(tricube(u1_2)).not.to.equal(0);
    expect(tricube(u2)).to.equal(0);
  });

  const triweight = kernel.triweight;
  it('kernel.triweight(u)', () => {
    expect(triweight).to.be.a('function');
    expect(triweight(u0)).not.to.equal(0);
    expect(triweight(u1)).to.equal(0);
    expect(triweight(u1_2)).not.to.equal(0);
    expect(triweight(u2)).to.equal(0);
  });
});
