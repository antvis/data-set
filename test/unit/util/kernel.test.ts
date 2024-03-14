import * as _ from 'lodash';

const kernel = require('../../../src/util/kernel').default;

describe('util: kernel functions', () => {
  const u0 = 0;
  const u1 = 1;
  const u1_2 = 1 / 2;
  const u2 = 2;

  it('api', () => {
    expect(_.keys(kernel)).toEqual([
      'boxcar',
      'cosine',
      'epanechnikov',
      'gaussian',
      'quartic',
      'triangular',
      'tricube',
      'triweight',
      'uniform',
    ]);
  });

  const uniform = kernel.boxcar;
  it('kernel.uniform(u)', () => {
    expect(typeof uniform).toBe('function');
    expect(uniform(u0)).toEqual(0.5);
    expect(uniform(u1)).toEqual(0.5);
    expect(uniform(u1_2)).toEqual(0.5);
    expect(uniform(u2)).toEqual(0);
  });

  const cosine = kernel.cosine;
  it('kernel.cosine(u)', () => {
    expect(typeof cosine).toBe('function');
    expect(cosine(u0)).not.toEqual(0);
    expect(cosine(u1)).not.toEqual(0);
    expect(cosine(u1_2)).not.toEqual(0);
    expect(cosine(u2)).toEqual(0);
  });

  const epanechnikov = kernel.epanechnikov;
  it('kernel.epanechnikov(u)', () => {
    expect(typeof epanechnikov).toBe('function');
    expect(epanechnikov(u0)).not.toEqual(0);
    expect(epanechnikov(u1)).toEqual(0);
    expect(epanechnikov(u1_2)).not.toEqual(0);
    expect(epanechnikov(u2)).toEqual(0);
  });

  const gaussian = kernel.gaussian;
  it('kernel.gaussian(u)', () => {
    expect(typeof gaussian).toBe('function');
    expect(gaussian(u0)).not.toEqual(0);
    expect(gaussian(u1)).not.toEqual(0);
    expect(gaussian(u1_2)).not.toEqual(0);
    expect(gaussian(u2)).not.toEqual(0);
  });

  const quartic = kernel.quartic;
  it('kernel.quartic(u)', () => {
    expect(typeof quartic).toBe('function');
    expect(quartic(u0)).not.toEqual(0);
    expect(quartic(u1)).toEqual(0);
    expect(quartic(u1_2)).not.toEqual(0);
    expect(quartic(u2)).toEqual(0);
  });

  const triangular = kernel.triangular;
  it('kernel.triangular(u)', () => {
    expect(typeof triangular).toBe('function');
    expect(triangular(u0)).not.toEqual(0);
    expect(triangular(u1)).toEqual(0);
    expect(triangular(u1_2)).not.toEqual(0);
    expect(triangular(u2)).toEqual(0);
  });

  const tricube = kernel.tricube;
  it('kernel.tricube(u)', () => {
    expect(typeof tricube).toBe('function');
    expect(tricube(u0)).not.toEqual(0);
    expect(tricube(u1)).toEqual(0);
    expect(tricube(u1_2)).not.toEqual(0);
    expect(tricube(u2)).toEqual(0);
  });

  const triweight = kernel.triweight;
  it('kernel.triweight(u)', () => {
    expect(typeof triweight).toBe('function');
    expect(triweight(u0)).not.toEqual(0);
    expect(triweight(u1)).toEqual(0);
    expect(triweight(u1_2)).not.toEqual(0);
    expect(triweight(u2)).toEqual(0);
  });
});
