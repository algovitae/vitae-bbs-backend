import { extendType, mutationType, objectType, queryType, stringArg } from "nexus"
import { User } from "./User"

export const UserIdentity = objectType({
  name: "UserIdentity",
  definition(t) {
    t.nonNull.id('email')
    t.nonNull.string('user_id')
    t.nonNull.string('password_hash')

    t.field('user', {
      type: User,
      async resolve(source, _args, context) {
        return context.userStore.get(source.user_id).exec()
      }
    })

  }
})
