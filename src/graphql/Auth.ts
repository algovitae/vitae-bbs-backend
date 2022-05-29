import { compare } from "bcrypt"
import { extendType, mutationType, objectType, queryType, stringArg } from "nexus"
import { userIdentityStore } from "../ddb/UserIdentity"
import { Query } from "./Query"
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
            async resolve(source, args, context) {
                const userIdentity = await context.userIdentityStore.get(args.email).exec()
                if (!userIdentity) {
                    return null
                }
                const compared = await compare(args.password ?? "", userIdentity.password_hash)
                if (!compared) {
                    return null
                }
                return {
                    token: Buffer.from(JSON.stringify({user_id: userIdentity.user_id, email: userIdentity.email})).toString('base64'), // TODO: 署名
                    user_identity: userIdentity
                }
            }
        })
    }
})

export const MeQuery = extendType({
    type: Query.name,
    definition(t) {
      t.nullable.field("userIdentityByAuthorization", { 
        type: UserIdentity,
        args: {
            
        },
        async resolve(source, args, context) {
          const email = await context.authSource.email();
          return email ? await context.userIdentityStore.get(email).exec() : null
        }
       })
    },
  })