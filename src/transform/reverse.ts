import { View } from '../view';

const reverse = (items: View['rows']): any[] => {
  const rows = [...(items || [])];
  return rows.reverse();
};
const reverseTransform = (dataView: View): void => {
  dataView.rows = reverse(dataView.rows);
};

export { reverse, reverseTransform };
