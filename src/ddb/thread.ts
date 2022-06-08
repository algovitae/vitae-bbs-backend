import {DynamoStore, Model, PartitionKey, Property, SortKey} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {uniq} from 'rambda';
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

const weakmap = new WeakMap<DynamoStore<ThreadModel>, DataLoader<{group_id: string; thread_id: string}, ThreadModel | undefined, {group_id: string; thread_id: string}>>();
export const threadDataLoaderFactory = (threadStore: DynamoStore<ThreadModel>) => {
  const cached = weakmap.get(threadStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (ids: ReadonlyArray<{group_id: string; thread_id: string}>) => {
    const retrieved = await threadStore.batchGet(uniq([...ids])).exec();
    return ids.map(id => retrieved.find(r => r.group_id === id.group_id && r.thread_id === id.thread_id));
  }, {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(threadStore, loader);
  return loader;
};

