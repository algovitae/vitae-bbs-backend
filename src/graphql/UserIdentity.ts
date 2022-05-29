import { extendType, objectType, queryType, stringArg } from "nexus"
import { Node } from "./Node"

export const UserIdentity = objectType({
  name: "UserIdentity",
  definition(t) {
    t.implements(Node)
    t.string('user_id')
    t.string('email')
    t.string('password_hash')
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