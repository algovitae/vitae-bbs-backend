import { extendType, list, nonNull, objectType, queryType } from "nexus"
import { resolve } from "path"
import { Group } from "./Group"
import { Query } from "./Query"
import { User } from "./User"

export const Membership = objectType({
    name: 'Membership',
    definition(t) {
        t.nonNull.string('user_id')
        t.nonNull.string('group_id')

        t.field("user", {
            type: nonNull(User),
            async resolve(source, args, context) {
                const dataloader = context.userDataLoader;
                return dataloader.load(source.user_id)
            }
        })

        t.field("group", {
            type: nonNull(Group),
            async resolve(source, args, context) {
                const dataloader = context.groupDataLoader;
                return dataloader.load(source.group_id)
            }
        })
    }
})