import { DynamoStore, GSIPartitionKey, GSISortKey, Model, PartitionKey, Property, Transient } from "@shiftcoders/dynamo-easy"
import DataLoader from "dataloader"
import { ddbTableSuffix } from "./tableSuffix"

@Model({
    tableName: `Membership${ddbTableSuffix}`
})
export class MembershipModel  {
  @PartitionKey()
  @GSISortKey('group_id_user_id_idx')
  user_id!: string

  @Property()
  @GSIPartitionKey('group_id_user_id_idx')
  group_id!: string
}

export const membershipStore = new DynamoStore(MembershipModel)
