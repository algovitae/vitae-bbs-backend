import { extendType, list, objectType, queryType } from "nexus"
import { Query } from "./Query"

export const Group = objectType({
    name: 'Group',
    definition(t) {
        t.nonNull.id('group_id')
        t.nonNull.string('group_name')
    }
})