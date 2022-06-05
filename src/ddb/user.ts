import {DynamoStore, Model, PartitionKey, Property} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {NexusGenFieldTypes, NexusGenObjects} from '../../nexus-typegen';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `User${ddbTableSuffix}`,
})
export class UserModel {
  @PartitionKey()
    user_id!: string;

  @Property()
    user_name!: string;
}

export const userStore = new DynamoStore(UserModel);

const weakmap = new WeakMap<DynamoStore<UserModel>, DataLoader<string, UserModel, string>>();
export const userDataLoaderFactory = (userStore: DynamoStore<UserModel>) => {
  const cached = weakmap.get(userStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (user_ids: readonly string[]) => userStore.batchGet(user_ids.map(user_id => ({user_id}))).exec(), {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(userStore, loader);
  return loader;
};
