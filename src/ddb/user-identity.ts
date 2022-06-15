import {DynamoStore, GSIPartitionKey, Model, PartitionKey, Property, Transient} from '@shiftcoders/dynamo-easy';
import objectHash from 'object-hash';
import {idMapperFactory, TableNames} from './node';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `${TableNames.UserIdentity}${ddbTableSuffix}`,
})
export class UserIdentityModel {
  static combinedId({email}: {email: string}) {
    return email;
  }

  @PartitionKey()
  @Property({mapper: idMapperFactory(TableNames.UserIdentity)})
    id!: string;

  @GSIPartitionKey('emailIndex')
    email!: string;

  @Property()
    passwordHash!: string;

  @GSIPartitionKey('userIdIndex')
  @Property({mapper: idMapperFactory(TableNames.User)})
    userId!: string;
}

export const userIdentityStore = new DynamoStore(UserIdentityModel);

