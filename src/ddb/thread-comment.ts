import {DynamoStore, Model, PartitionKey, Property, SortKey} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {uniq} from 'rambda';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `ThreadComment${ddbTableSuffix}`,
})
export class ThreadCommentModel {
  @PartitionKey()
    thread_id!: string;

  @SortKey()
    comment_id!: string;

  @Property()
    title!: string;

  @Property()
    body!: string;

  @Property()
    commented_by!: string;

  @Property()
    commented_at!: string;
}

export const threadCommentStore = new DynamoStore(ThreadCommentModel);

const weakmap = new WeakMap<DynamoStore<ThreadCommentModel>, DataLoader<{thread_id: string; comment_id: string}, ThreadCommentModel | undefined, {thread_id: string; comment_id: string}>>();
export const threadCommentDataLoaderFactory = (threadCommentStore: DynamoStore<ThreadCommentModel>) => {
  const cached = weakmap.get(threadCommentStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (ids: ReadonlyArray<{thread_id: string; comment_id: string}>) => {
    const retrieved = await threadCommentStore.batchGet(uniq([...ids])).exec();
    return ids.map(id => retrieved.find(r => r.thread_id === id.thread_id && r.comment_id === id.comment_id));
  }, {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(threadCommentStore, loader);
  return loader;
};

