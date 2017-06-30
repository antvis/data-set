const assign = require('lodash/assign');
const some = require('lodash/some');
const {
  geoArea,
  geoCentroid,
  geoContains,
  geoDistance,
  geoLength
} = require('d3-geo');
const {
  geoProject
} = require('d3-geo-projection');
const DataView = require('../data-view');
const getGeoProjection = require('../util/get-geo-projection');

assign(DataView.prototype, {
  // geo maintain
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
      if (feature.name === name) {
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
  geoContains(feature, position/* [longitude, latitude] */) {
    return geoContains(feature, position);
  },
  geoFeatureByPoint(position) {
    const rows = this.rows;
    let result;
    some(rows, feature => {
      if (geoContains(feature, position)) {
        result = feature;
        return true;
      }
    });
    return result;
  },
  geoNameByPoint(position) {
    const feature = this.geoFeatureByPoint(position);
    if (feature) {
      return feature.name;
    }
  },
  // projection
  geoProject(feature, projection) {
    projection = getGeoProjection(projection);
    return geoProject(feature, projection);
  },
  geoProjectPoint(position, projection) {
    projection = getGeoProjection(projection);
    return projection(position);
  },
  geoProjectInvert(point, projection) {
    projection = getGeoProjection(projection);
    return projection.invert(point);
  }
});
