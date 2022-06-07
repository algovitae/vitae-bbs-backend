import {DynamoStore, Model, PartitionKey, Property, SortKey} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `Thread${ddbTableSuffix}`,
})
export class ThreadModel {
  @PartitionKey()
    group_id!: string;

  @SortKey()
    thread_id!: string;

  @Property()
    thread_name!: string;
}

export const threadStore = new DynamoStore(ThreadModel);

const weakmap = new WeakMap<DynamoStore<ThreadModel>, DataLoader<string, ThreadModel, string>>();
export const threadDataLoaderFactory = (groupStore: DynamoStore<ThreadModel>) => {
  const cached = weakmap.get(groupStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (thread_ids: readonly string[]) => threadStore.batchGet(thread_ids.map(thread_id => ({thread_id}))).exec(), {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(threadStore, loader);
  return loader;
};

