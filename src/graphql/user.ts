import {extendType, list, nonNull, objectType, queryType} from 'nexus';
// eslint-disable-next-line import/no-cycle
import {Membership} from './membership';
import {Query} from './query';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('user_id');
    t.nonNull.string('user_name');

    t.field('memberships', {
      type: nonNull(list(nonNull(Membership))),
      async resolve(source, args, context) {
        const memberships = await context.membershipStore.query().wherePartitionKey(source.user_id).exec();
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
      authorize: async (root, args, context) => context.authSource.canViewAllUsers(),
      async resolve(source, args, context) {
        const users = await context.userStore.scan().exec();
        return users;
      },
    });
  },
});

