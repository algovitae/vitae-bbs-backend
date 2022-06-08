import {DynamoStore, Model, PartitionKey, Property, SortKey} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
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

const weakmap = new WeakMap<DynamoStore<ThreadCommentModel>, DataLoader<string, ThreadCommentModel, string>>();
export const threadCommentDataLoaderFactory = (threadCommentStore: DynamoStore<ThreadCommentModel>) => {
  const cached = weakmap.get(threadCommentStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (thread_ids: readonly string[]) => threadCommentStore.batchGet(thread_ids.map(thread_id => ({thread_id}))).exec(), {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(threadCommentStore, loader);
  return loader;
};

