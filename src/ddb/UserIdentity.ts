import { DynamoStore, GSIPartitionKey, Model, PartitionKey, Property, Transient } from "@shiftcoders/dynamo-easy"
import { ddbTableSuffix } from "./tableSuffix"

@Model({
    tableName: `UserIdentity${ddbTableSuffix}`
})
export class UserIdentityModel {
  @PartitionKey()
  email!: string

  @Property()
  password_hash!: string

  @GSIPartitionKey('user_id_idx')
  user_id!: string
}

export const userIdentityStore = new DynamoStore(UserIdentityModel)