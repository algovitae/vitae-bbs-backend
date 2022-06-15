import {Buffer} from 'node:buffer';
import {compare} from 'bcrypt';
import {extendType, mutationType, nonNull, nullable, objectType, queryType, stringArg} from 'nexus';
import {UserIdentityModel, userIdentityStore} from '../ddb/user-identity';
import {createRawIdFactory, TableNames} from '../ddb/node';
import {Mutation} from './mutation';
import {Query} from './query';
import {UserIdentity} from './user-identity';

export const Auth = objectType({
  name: 'Auth',
  definition(t) {
    t.string('token');
    t.field('userIdentity', {
      type: UserIdentity,
    });
  },
});

export const AuthMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('login', {
      type: Auth,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(source, args, context) {
        console.debug('login attempt', args.email);
        if (!args.email || !args.password) {
          return null;
        }

        const userIdentity = await context.userIdentityStore.get(createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: args.email}))).exec();
        if (!userIdentity) {
          console.debug('login attempt failed', 'no user');
          return null;
        }

        const compared = await compare(args.password, userIdentity.passwordHash);
        if (!compared) {
          console.debug('login attempt failed', 'wrong password');
          return null;
        }

        console.debug('login attempt success', userIdentity);
        return {
          token: Buffer.from(JSON.stringify({userId: userIdentity.userId, email: userIdentity.email})).toString('base64'), // TODO: 署名
          userIdentity,
        };
      },
    });
  },
});

export const MeQuery = extendType({
  type: Query.name,
  definition(t) {
    t.field('userIdentityByAuthorization', {
      type: nullable(UserIdentity),
      args: {},
      async resolve(source, args, context) {
        const email = await context.authSource.email();
        if (!email) {
          return null;
        }

        const userIdentity = context.userIdentityStore.get(createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email}))).exec();
        return userIdentity ?? null;
      },
    });
  },
});

