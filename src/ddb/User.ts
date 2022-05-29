import { DynamoStore, Model, PartitionKey, Property } from "@shiftcoders/dynamo-easy"
import { NexusGenFieldTypes, NexusGenObjects } from "../../nexus-typegen"
import { ddbTableSuffix } from "./tableSuffix"

@Model({
    tableName: `User${ddbTableSuffix}`
})
export class UserModel  {
  @PartitionKey()
  user_id!: string

  @Property()
  user_name!: string
}

export const userStore = new DynamoStore(UserModel)