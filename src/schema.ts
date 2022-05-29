import { interfaceType, makeSchema, objectType, queryType } from "nexus";
import { join } from "path";
import { AuthMutation, MeQuery } from "./graphql/Auth";
import { User } from "./graphql/User";
import { UserIdentity, UserIdentityQuery } from "./graphql/UserIdentity";

// TODO: relationなどを明確にする
// TODO: PK,SKの組み合わせの場合にどうするべきか考える



// const Group = objectType({
//     name: "Group",
//     isTypeOf(source) {
//         return 'group_name' in source
//     },
//     definition(t) {
//         t.implements(Node)
//         t.string("group_name")
//     }
// })

// const Membership = objectType({
//     name: "Membership",
//     isTypeOf(source) {
//         return 'user_id' in source && 'group_id' in source
//     },
//     definition(t) {
//         t.implements(Node)
//         t.string("group_id")
//         t.string("user_id")
//     }
// })


// const Thread = objectType({
//     name: "Thread",
//     isTypeOf(source) {
//         return 'theread_name' in source
//     },
//     definition(t) {
//         t.implements(Node)
//         t.string("group_id")
//         t.string("thread_id")
//         t.string("thread_name")
//     }
// })

// const ThreadComment = objectType({
//     name: "ThreadComment",
//     isTypeOf(source) {
//         return 'comment_id' in source
//     },
//     definition(t) {
//         t.implements(Node)
//         t.string("thread_id")
//         t.string("comment_id")
//         t.string("title")
//         t.string("body")
//         t.string("comment_by")
//     }
// })

export const schema = makeSchema({
  types: {
    AuthMutation,
    MeQuery,
    User,
    UserIdentity,
    UserIdentityQuery
    // Group,
    // Membership,
    // Thread,
    // ThreadComment
  },
  contextType: { module: join(__dirname, 'graphql', 'context', 'AppContext.ts'), export: 'AppContext' },
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
})