import { extendType, mutationType, objectType, queryType, stringArg } from "nexus"
import { userStore } from "../ddb/User"
import { Node } from "./Node"
import { User } from "./User"

export const UserIdentity = objectType({
  name: "UserIdentity",
  definition(t) {
    t.implements(Node)
    t.nonNull.string('user_id')
    t.nonNull.string('email')
    t.nonNull.string('password_hash')

    t.field('user', {
      type: User,
      async resolve(source, _args, context) {
        return userStore.get(source.user_id).exec()
      }
    })
    
  }
})

export const UserIdentityQuery = queryType({
  definition(t) {
    t.field('userIdentityByEmail', {
      type: UserIdentity,
      args: {
        email: stringArg()
      },
      resolve() {
        return { id: 'UserIdentity/8fe790de-dee7-11ec-94cf-0242ac140002', email: 'dummy@example.org', password_hash: '$2a$12$60/wigMCSIg5JpHAjxHS9ukk9RIZHRD1oynlLT6ObdMQScLRq2DiG', 'user_id': 'User/d405b106-dee7-11ec-a125-0242ac140002'}
      }
    })
  }
})