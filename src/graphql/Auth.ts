import { compare } from "bcrypt"
import { mutationType, objectType, stringArg } from "nexus"
import { userIdentityStore } from "../ddb/UserIdentity"
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
                    token: 'the token',
                    user_identity: userIdentity
                }
            }
        })
    }
})