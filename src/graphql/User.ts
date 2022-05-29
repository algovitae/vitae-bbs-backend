import { extendType, list, objectType, queryType } from "nexus"
import { Node } from "./Node"
import { Query } from "./Query"

export const User = objectType({
    name: 'User',
    definition(t) {
        t.implements(Node)
        t.nonNull.string('user_name')
    }
})


export const UserQuery = extendType({
    type: Query.name,
    definition(t) {
      t.nullable.field("allUsers", { 
        type: list(User),
        authorize: (root, args, context) => context.authSource.canViewAllUsers(),
        async resolve(source, args, context) {
            const users = await context.userStore.scan().exec()
            return users;
        }
       })
    },
  })