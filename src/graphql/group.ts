import {TransactPut, TransactWriteRequest} from '@shiftcoders/dynamo-easy';
import {Source} from 'graphql';
import ksuid from 'ksuid';
import {extendType, list, nonNull, objectType, queryType, stringArg} from 'nexus';
import {GroupModel} from '../ddb/group';
import {MembershipModel} from '../ddb/membrtship';
import {Mutation} from './mutation';
import {Query} from './query';
import {Thread} from './thread';

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.nonNull.id('group_id');
    t.nonNull.string('group_name');
    t.nonNull.field('threads', {
      type: nonNull(list(nonNull(Thread))),
      async resolve(source, args, context) {
        const threads = await context.threadStore.query().wherePartitionKey(source.group_id).exec();
        return threads;
      },
    });
  },
});

export const GroupQuery = extendType({
  type: Query.name,
  definition(t) {
    t.nullable.field('group', {
      type: Group,
      args: {
        group_id: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return context.authSource.canViewGroup(args.group_id);
      },
      async resolve(source, args, context) {
        const group = await context.groupDataLoader.load(args.group_id);
        return group!;
      },
    });
  },
});

export const GroupMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('createGroup', {
      type: Group,
      args: {
        group_name: nonNull(stringArg()),
        memberships: nonNull(list(nonNull(stringArg()))),
      },
      async authorize(root, args, context) {
        return (context.authSource.isAuthorized());
      },
      async resolve(source, args, context) {
        // TODO: 25アイテム以上はDynamoDBの仕様上無理なので、制限をかける
        const group_id = ksuid.randomSync().toString();
        const transaction = new TransactWriteRequest();
        transaction.transact(
          new TransactPut(GroupModel, {group_id, group_name: args.group_name}),
        );
        for (const user_id of args.memberships) {
          transaction.transact(
            new TransactPut(MembershipModel, {group_id, user_id}),
          );
        }

        await transaction.exec();
        return {
          group_id,
          group_name: args.group_name,
        };
      },
    });
  },
});

