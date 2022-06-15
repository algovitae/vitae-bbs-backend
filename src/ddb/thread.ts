import {DynamoStore, GSIPartitionKey, Model, PartitionKey, Property, SortKey} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {uniq} from 'rambda';
import {idMapperFactory, TableNames} from './node';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `${TableNames.Thread}${ddbTableSuffix}`,
})
export class ThreadModel {
  @PartitionKey()
  @Property({mapper: idMapperFactory(TableNames.Thread)})
    id!: string;

  @GSIPartitionKey('groupIdIndex')
  @Property({mapper: idMapperFactory(TableNames.Group)})
    groupId!: string;

  @Property()
    threadName!: string;
}

export const threadStore = new DynamoStore(ThreadModel);

const weakmap = new WeakMap<DynamoStore<ThreadModel>, DataLoader<string, ThreadModel | undefined, string>>();
export const threadDataLoaderFactory = (threadStore: DynamoStore<ThreadModel>) => {
  const cached = weakmap.get(threadStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (ids: readonly string[]) => {
    const retrieved = await threadStore.batchGet(uniq([...ids]).map(id => ({id}))).exec();
    return ids.map(id => retrieved.find(r => r.id === id));
  }, {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(threadStore, loader);
  return loader;
};

