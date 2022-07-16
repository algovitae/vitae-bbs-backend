import {extendType, list, nonNull, objectType, queryType} from 'nexus';

import {Membership} from './membership';
import {Node} from './node';
import {Query} from './query';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('userName');
    t.nonNull.string('userTitle');

    t.field('memberships', {
      type: nonNull(list(nonNull(Membership))),
      authorize: async (root, args, context) => context.authSource.canViewAllUsers(),
      async resolve(source, _args, context) {
        const memberships = await context.membershipStore.query().index('userIdIndex').wherePartitionKey(source.id).exec();
        return memberships;
      },
    });
  },
});

export const UserQuery = extendType({
  type: Query.name,
  definition(t) {
    t.nullable.field('allUsers', {
      type: nonNull(list(nonNull(User))),
      authorize: async (_root, _args, context) => context.authSource.canViewAllUsers(),
      async resolve(_source, _args, context) {
        const users = await context.userStore.scan().exec();
        return users;
      },
    });
  },
});

