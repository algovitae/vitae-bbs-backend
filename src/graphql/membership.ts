import {resolve} from 'node:path';
import {extendType, list, nonNull, objectType, queryType, stringArg} from 'nexus';
import {Group} from './group';
import {Query} from './query';

import {User} from './user';
import { Mutation } from './mutation';
import { MembershipModel } from '../ddb/membrtship';

export const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.nonNull.string('user_id');
    t.nonNull.string('group_id');

    t.field('user', {
      type: nonNull(User),
      async resolve(source, args, context) {
        const dataloader = context.userDataLoader;
        return (await dataloader.load(source.user_id))!;
      },
    });

    t.field('group', {
      type: nonNull(Group),
      async resolve(source, args, context) {
        const dataloader = context.groupDataLoader;
        return (await dataloader.load(source.group_id))!;
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
        user_id: nonNull(stringArg()),
        group_id: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewGroup(args.group_id));
      },
      async resolve(source, args, context) {
        const item: MembershipModel = {
          user_id: args.user_id,
          group_id: args.group_id,
        }
        await context.membershipStore.put(item).exec();
        return item;
      },
    });

    
    t.field('deleteMembership', {
      type: Group, //TODO: 何を返せばいいんだ？？ Membershipではないよな・・
      args: {
        user_id: nonNull(stringArg()),
        group_id: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewGroup(args.group_id));
      },
      async resolve(source, args, context) {
        await context.membershipStore.delete(args.user_id, args.group_id).exec();
        const group = await context.groupDataLoader.load(args.group_id);
        return group;
      },
    });
  },
});

