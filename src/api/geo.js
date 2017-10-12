const assign = require('lodash/assign');
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
const View = require('../view');
const getGeoProjection = require('../util/get-geo-projection');

assign(View.prototype, {
  // geo maintain
  geoArea(feature) {
    return geoArea(feature);
  },
  geoAreaByName(name) {
    return geoArea(this.geoFeatureByName(name));
  },
  geoCentroid(feature) {
    return geoCentroid(feature);
  },
  geoCentroidByName(name) {
    return geoCentroid(this.geoFeatureByName(name));
  },
  geoDistance(p1, p2) {
    return geoDistance(p1, p2);
  },
  geoLength(feature) {
    return geoLength(feature);
  },
  geoLengthByName(name) {
    return geoLength(this.geoFeatureByName(name));
  },
  geoContains(feature, position/* [longitude, latitude] */) {
    return geoContains(feature, position);
  },
  geoFeatureByName(name) {
    const rows = this.rows;
    let result;
    rows.some(feature => {
      if (feature.name === name) {
        result = feature;
        return true;
      }
      return false;
    });
    return result;
  },
  geoFeatureByPosition(position) {
    const rows = this.rows;
    let result;
    rows.some(feature => {
      if (geoContains(feature, position)) {
        result = feature;
        return true;
      }
      return false;
    });
    return result;
  },
  geoNameByPosition(position) {
    const feature = this.geoFeatureByPosition(position);
    if (feature) {
      return feature.name;
    }
  },
  // projection
  geoProject(feature, projection) {
    projection = getGeoProjection(projection);
    return geoProject(feature, projection);
  },
  geoProjectByName(name, projection) {
    projection = getGeoProjection(projection);
    return geoProject(this.geoFeatureByName(name), projection);
  },
  geoProjectPosition(position, projection) {
    projection = getGeoProjection(projection);
    return projection(position);
  },
  geoProjectInvert(point/* [x, y] */, projection) {
    projection = getGeoProjection(projection);
    return projection.invert(point);
  }
});
