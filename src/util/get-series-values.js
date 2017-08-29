
module.exports = (extent, bandwidth = 1) => {
  const [ min, max ] = extent;
  const values = [];
  let tmp = min;
  while (tmp < max) {
    values.push(tmp);
    tmp += bandwidth;
  }
  values.push(max);
  return values;
};
