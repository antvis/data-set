import getPointAtLength from 'point-at-length';
import { deepMix } from '@antv/util';
import { geoPath } from 'd3-geo';
import { DataSet } from '../data-set';
import { View } from '../view';

const geoPathGenerator = geoPath();

function GeoJSONConnector(data: any, _options: undefined, dataView: View): any {
  dataView.dataType = DataSet.CONSTANTS.GEO;
  const features: any[] = deepMix([], data.features);

  // pre-process
  features.forEach((feature) => {
    feature.name = feature.properties.name;
    feature.longitude = [];
    feature.latitude = [];
    const pathData = (feature.pathData = geoPathGenerator(feature));
    const points = getPointAtLength(pathData);
    points._path.forEach((point: any[]) => {
      feature.longitude.push(point[1]);
      feature.latitude.push(point[2]);
    });
    const centroid = geoPathGenerator.centroid(feature);
    feature.centroidX = centroid[0];
    feature.centroidY = centroid[1];
  });

  // dataView.origin = features;
  return features;
}

DataSet.registerConnector('geo', GeoJSONConnector);
DataSet.registerConnector('geojson', GeoJSONConnector);
DataSet.registerConnector('GeoJSON', GeoJSONConnector);

export default GeoJSONConnector;
