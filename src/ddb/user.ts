import {DynamoStore, Model, PartitionKey, Property} from '@shiftcoders/dynamo-easy';
import DataLoader from 'dataloader';
import {uniq} from 'rambda';
import {idMapperFactory, TableNames} from './node';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `${TableNames.User}${ddbTableSuffix}`,
})
export class UserModel {
  @PartitionKey()
  @Property({mapper: idMapperFactory(TableNames.User)})
    id!: string;

  @Property()
    userName!: string;

  @Property()
    userTitle!: string;
}

export const userStore = new DynamoStore(UserModel);

const weakmap = new WeakMap<DynamoStore<UserModel>, DataLoader<string, UserModel | undefined, string>>();
export const userDataLoaderFactory = (userStore: DynamoStore<UserModel>) => {
  const cached = weakmap.get(userStore);
  if (cached) {
    return cached;
  }

  const loader = new DataLoader(async (ids: readonly string[]) => {
    const retrieved = await userStore.batchGet(uniq([...ids]).map(id => ({id}))).exec();
    return ids.map(id => retrieved.find(r => r.id === id));
  }, {
    cache: false,
    maxBatchSize: 100,
  });
  weakmap.set(userStore, loader);
  return loader;
};

