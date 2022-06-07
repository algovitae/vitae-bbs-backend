import path, {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fieldAuthorizePlugin, interfaceType, makeSchema, objectType, queryType} from 'nexus';
import {AuthMutation, MeQuery} from './graphql/auth';
import {Group, GroupMutation, GroupQuery} from './graphql/group';
import {User, UserQuery} from './graphql/user';
import {UserIdentity} from './graphql/user-identity';

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
    UserQuery,
    UserIdentity,
    Group,
    GroupQuery,
    GroupMutation,
    // Membership,
    // Thread,
    // ThreadComment
  },
  // eslint-disable-next-line unicorn/prefer-module
  contextType: {module: join(__dirname, 'graphql', 'context', 'app-context.ts'), export: 'AppContext'},
  plugins: [
    fieldAuthorizePlugin(),
  ],
  outputs: {
    // eslint-disable-next-line unicorn/prefer-module
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    // eslint-disable-next-line unicorn/prefer-module
    schema: join(__dirname, '..', 'schema.graphql'),
  },
});

