import { assign, values } from '@antv/util';
import partition from '../util/partition';
import { View } from '../view';

assign(View.prototype, {
  partition(
    this: View,
    group_by: string | string[] | ((item: any) => string),
    order_by: string | string[] | ((item: any) => number) = []
  ) {
    return partition(this.rows, group_by, order_by);
  },
  group(
    this: View,
    group_by: string | string[] | ((item: any) => string),
    order_by: string | string[] | ((item: any) => number) = []
  ) {
    const groups = this.partition(group_by, order_by);
    return values(groups);
  },
  groups(
    this: View,
    group_by: string | string[] | ((item: any) => string),
    order_by: string | string[] | ((item: any) => number) = []
  ) {
    return this.group(group_by, order_by);
  },
});

export interface PartitionApi {
  partition(
    group_by: string | string[] | ((item: any) => string),
    order_by?: string | string[] | ((item: any) => number)
  ): any;
  group(
    group_by: string | string[] | ((item: any) => string),
    order_by?: string | string[] | ((item: any) => number)
  ): any;
  groups(
    group_by: string | string[] | ((item: any) => string),
    order_by?: string | string[] | ((item: any) => number)
  ): any;
}
