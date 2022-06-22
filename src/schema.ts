import path, {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {fieldAuthorizePlugin, interfaceType, makeSchema, objectType, queryType} from 'nexus';
import {AuthMutation, MeQuery} from './graphql/auth';
import {Group, GroupMutation, GroupQuery} from './graphql/group';
import {User, UserQuery} from './graphql/user';
import {UserIdentity, UserIdentityMutation} from './graphql/user-identity';
import {ThreadMutation, ThreadQuery} from './graphql/thread';
import {ThreadCommentMutation} from './graphql/thread-comment';
import {MembershipMutation} from './graphql/membership';

const isLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
const isTsNode = Boolean(process.env.TS_NODE_DEV);

export const schema = makeSchema({
  types: {
    AuthMutation,
    MeQuery,
    User,
    UserQuery,
    UserIdentity,
    UserIdentityMutation,
    Group,
    GroupQuery,
    GroupMutation,
    MembershipMutation,
    ThreadMutation,
    ThreadQuery,
    ThreadCommentMutation,
  },
  // eslint-disable-next-line unicorn/prefer-module
  contextType: {module: join(__dirname, 'graphql', 'context', isTsNode ? 'app-context.ts' : 'app-context.js'), export: 'AppContext'},
  plugins: [
    fieldAuthorizePlugin(),
  ],
  // MEMO: AWS Lambda上ではファイル生成をさせない
  outputs: isLambda ? undefined : {
    // eslint-disable-next-line unicorn/prefer-module
    typegen: join(__dirname, '..', 'nexus-typegen.d.ts'),
    // eslint-disable-next-line unicorn/prefer-module
    schema: join(__dirname, '..', 'schema.graphql'),
  },
});

