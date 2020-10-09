import { geoGraticule } from 'd3-geo';
import { View } from '../view';

export default function geoGraticuleconnector(_options: any, dataView: View): any {
  dataView.dataType = 'geo-graticule';
  const data: any[] = geoGraticule().lines();

  data.map((row, index) => {
    row.index = `${index}`;
    return row;
  });

  dataView.rows = data;
  return data;
}
