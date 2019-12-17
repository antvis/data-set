/*
 * @reference: https://github.com/jasondavies/science.js/blob/master/src/stats/kernel.js
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js#L16
 */
function uniform(u: number) {
  return Math.abs(u) <= 1 ? 0.5 : 0;
}

function tricubed(u: number) {
  const abs = 1 - Math.pow(Math.abs(u), 3);
  return Math.pow(abs, 3);
}

export default {
  boxcar: uniform,
  cosine(u: number) {
    if (Math.abs(u) <= 1) {
      return (Math.PI / 4) * Math.cos((Math.PI / 2) * u);
    }
    return 0;
  },
  epanechnikov(u: number) {
    return Math.abs(u) < 1 ? 0.75 * (1 - u * u) : 0;
  },
  gaussian(u: number) {
    // return 1 / Math.sqrt(2 * Math.PI) * Math.exp(-0.5 * u * u);
    return 0.3989422804 * Math.exp(-0.5 * u * u);
  },
  quartic(u: number) {
    if (Math.abs(u) < 1) {
      const tmp = 1 - u * u;
      return (15 / 16) * tmp * tmp;
    }
    return 0;
  },
  triangular(u: number) {
    const abs = Math.abs(u);
    return abs < 1 ? 1 - abs : 0;
  },
  tricube(u: number) {
    return Math.abs(u) < 1 ? (70 / 81) * tricubed(u) : 0;
  },
  triweight(u: number) {
    if (Math.abs(u) < 1) {
      const tmp = 1 - u * u;
      return (35 / 32) * tmp * tmp * tmp;
    }
    return 0;
  },
  uniform,
};
