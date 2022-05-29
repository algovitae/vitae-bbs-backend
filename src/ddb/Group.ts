import { DynamoStore, Model, PartitionKey, Property } from "@shiftcoders/dynamo-easy"
import DataLoader from "dataloader"
import { ddbTableSuffix } from "./tableSuffix"

@Model({
    tableName: `Group${ddbTableSuffix}`
})
export class GroupModel {
    @PartitionKey()
    group_id!: string

    @Property()
    group_name!: string
}

export const groupStore = new DynamoStore(GroupModel)


const weakmap = new WeakMap<Object, DataLoader<string, GroupModel, string>>()
export const groupDataLoaderFactory = (groupStore: DynamoStore<GroupModel>) => {
    const cached = weakmap.get(groupStore)
    if (cached) {
        return cached
    }
    const loader = new DataLoader(async (group_ids: readonly string[]) => {
        return groupStore.batchGet(group_ids.map(group_id => ({ group_id }))).exec()
    }, {
        cache: false,
        maxBatchSize: 100,
    })
    weakmap.set(groupStore, loader)
    return loader
}