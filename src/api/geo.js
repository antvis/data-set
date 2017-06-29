const assign = require('lodash/assign');
const some = require('lodash/some');
const {
  geoArea,
  geoCentroid,
  geoContains,
  geoDistance,
  geoLength
} = require('d3-geo');
const DataView = require('../data-view');

assign(DataView.prototype, {
  // geo
  geoArea(feature) {
    return geoArea(feature);
  },
  geoCentroid(feature) {
    return geoCentroid(feature);
  },
  geoCentroidByName(name) {
    const rows = this.rows;
    let centroid;
    some(rows, feature => {
      if (feature.properties.name === name) {
        centroid = geoCentroid(feature);
        return true;
      }
    });
    return centroid;
  },
  geoDistance(p1, p2) {
    return geoDistance(p1, p2);
  },
  geoLength(feature) {
    return geoLength(feature);
  },
  geoContains(feature, point) {
    return geoContains(feature, point);
  },
  geoFeatureByPoint(point) {
    const rows = this.rows;
    let result;
    some(rows, feature => {
      if (geoContains(feature, point)) {
        result = feature;
        return true;
      }
    });
    return result;
  },
  geoNameByPoint(point) {
    const feature = this.geoFeatureByPoint(point);
    if (feature) {
      return feature.properties.name;
    }
  }
});
