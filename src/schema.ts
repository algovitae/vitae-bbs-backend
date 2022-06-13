import path, {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fieldAuthorizePlugin, interfaceType, makeSchema, objectType, queryType} from 'nexus';
import {AuthMutation, MeQuery} from './graphql/auth';
import {Group, GroupMutation, GroupQuery} from './graphql/group';
import {User, UserQuery} from './graphql/user';
import {UserIdentity} from './graphql/user-identity';
import {ThreadQuery} from './graphql/thread';

const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const isTsNode = !!process.env.TS_NODE_DEV;

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
    ThreadQuery,
    // ThreadComment
  },
  // eslint-disable-next-line unicorn/prefer-module
  contextType: {module: join(__dirname, 'graphql', 'context', isTsNode ? 'app-context.ts' : 'app-context.js'), export: 'AppContext'},
  plugins: [
    fieldAuthorizePlugin(),
  ],
  // MEMO: AWS Lambda上ではファイル生成をさせない
  outputs: isLambda ? undefined : {
    // eslint-disable-next-line unicorn/prefer-module
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    // eslint-disable-next-line unicorn/prefer-module
    schema: join(__dirname, '..', 'schema.graphql'),
  },
});

