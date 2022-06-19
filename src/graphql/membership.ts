import {resolve} from 'node:path';
import {extendType, list, nonNull, nullable, objectType, queryType, stringArg} from 'nexus';
import {MembershipModel} from '../ddb/membrtship';
import {createRawIdFactory, TableNames} from '../ddb/node';
import {Group} from './group';
import {Query} from './query';

import {User} from './user';
import {Mutation} from './mutation';
import {Node} from './node';

export const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('userId');
    t.nonNull.string('groupId');

    t.field('user', {
      type: nonNull(User),
      async resolve(source, args, context) {
        const dataloader = context.userDataLoader;
        return (await dataloader.load(source.userId))!;
      },
    });

    t.field('group', {
      type: nonNull(Group),
      async resolve(source, args, context) {
        const dataloader = context.groupDataLoader;
        return (await dataloader.load(source.groupId))!;
      },
    });
  },
});

export const MembershipMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('addMembership', {
      type: Membership,
      args: {
        userId: nonNull(stringArg()),
        groupId: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewGroup(args.groupId));
      },
      async resolve(source, args, context) {
        const item: MembershipModel = {
          id: createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({userId: args.userId, groupId: args.groupId})),
          userId: args.userId,
          groupId: args.groupId,
        };
        await context.membershipStore.put(item).exec();
        return item;
      },
    });

    t.field('deleteMembership', {
      type: nullable(Group), // TODO: 何を返せばいいんだ？？ Membershipではないよな・・
      args: {
        userId: nonNull(stringArg()),
        groupId: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewGroup(args.groupId));
      },
      async resolve(source, args, context) {
        await context.membershipStore.delete(createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({userId: args.userId, groupId: args.groupId}))).exec();
        const group = await context.groupDataLoader.load(args.groupId);
        return group ?? null;
      },
    });
  },
});

