import { mutationType, objectType, stringArg } from "nexus"
import { UserIdentity } from "./UserIdentity"

export const Auth = objectType({
    name: "Auth",
    definition(t) {
        t.string("token"),
        t.field("user_identity", {
            type: UserIdentity,
        })
    }
})

export const AuthMutation = mutationType({
    definition(t) {
      t.field("login", {
        type: Auth,
        args: {
            email: stringArg(),
            password: stringArg(),
        },
        resolve(source, args, context) {
            if (args.password === 'password') {
                return { token: 'the token', user_identity: { user_id: 'UserIdentity/8fe790de-dee7-11ec-94cf-0242ac140002' }}
            } else {
                return null;
            }
        }
      })
    }
  })