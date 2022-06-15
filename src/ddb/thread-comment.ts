import {dateToStringMapper, DynamoStore, GSIPartitionKey, Model, PartitionKey, Property, SortKey} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {uniq} from 'rambda';
import {idMapperFactory, TableNames} from './node';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `${TableNames.ThreadComment}${ddbTableSuffix}`,
})
export class ThreadCommentModel {
  @PartitionKey()
  @Property({mapper: idMapperFactory(TableNames.ThreadComment)})
    id!: string;

  @GSIPartitionKey('threadIdIndex')
  @Property({mapper: idMapperFactory(TableNames.Thread)})
    threadId!: string;

  @Property()
    title!: string;

  @Property()
    body!: string;

  @Property()
  @Property({mapper: idMapperFactory(TableNames.User)})
    commentedBy!: string;

  @Property()
    commentedAt!: string;
}

export const threadCommentStore = new DynamoStore(ThreadCommentModel);

const weakmap = new WeakMap<DynamoStore<ThreadCommentModel>, DataLoader<string, ThreadCommentModel | undefined, string>>();
export const threadCommentDataLoaderFactory = (threadCommentStore: DynamoStore<ThreadCommentModel>) => {
  const cached = weakmap.get(threadCommentStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (ids: readonly string[]) => {
    const retrieved = await threadCommentStore.batchGet(uniq([...ids]).map(id => ({id}))).exec();
    return ids.map(id => retrieved.find(r => r.id === id));
  }, {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(threadCommentStore, loader);
  return loader;
};

