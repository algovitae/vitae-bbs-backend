import {DynamoStore, Model, PartitionKey, Property} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {uniq} from 'rambda';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `Group${ddbTableSuffix}`,
})
export class GroupModel {
  @PartitionKey()
    id!: string;

  @Property()
    groupName!: string;
}

export const groupStore = new DynamoStore(GroupModel);

const weakmap = new WeakMap<DynamoStore<GroupModel>, DataLoader<string, GroupModel | undefined, string>>();
export const groupDataLoaderFactory = (groupStore: DynamoStore<GroupModel>) => {
  const cached = weakmap.get(groupStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (ids: readonly string[]) => {
    const retrieved = await groupStore.batchGet(uniq([...ids]).map(id => ({id}))).exec();
    return ids.map(g => retrieved.find(r => r.id === g));
  }, {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(groupStore, loader);
  return loader;
};

