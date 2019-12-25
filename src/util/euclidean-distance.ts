/*
 * @reference: https://github.com/zeke/euclidean-distance
 */
export default (a: number[], b: number[]) => {
  let sum = 0;
  let n;
  for (n = 0; n < a.length; n++) {
    sum += Math.pow(a[n] - b[n], 2);
  }
  return Math.sqrt(sum);
};
