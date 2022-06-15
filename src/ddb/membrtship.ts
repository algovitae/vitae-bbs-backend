import {DynamoStore, GSIPartitionKey, GSISortKey, Model, PartitionKey, Property, SortKey, Transient} from '@shiftcoders/dynamo-easy';
import objectHash from 'object-hash';
import {idMapperFactory, TableNames} from './node';
import {ddbTableSuffix} from './table-suffix';

@Model({
  tableName: `${TableNames.Membership}${ddbTableSuffix}`,
})
export class MembershipModel {
  static combinedId({userId, groupId}: {userId: string; groupId: string}) {
    return `${userId}:${groupId}`;
  }

  @PartitionKey()
  @Property({mapper: idMapperFactory(TableNames.Membership)})
    id!: string;

  @GSIPartitionKey('userIdIndex')
  @Property({mapper: idMapperFactory(TableNames.User)})
    userId!: string;

  @GSIPartitionKey('groupIdIndex')
  @Property({mapper: idMapperFactory(TableNames.Group)})
    groupId!: string;
}

export const membershipStore = new DynamoStore(MembershipModel);
