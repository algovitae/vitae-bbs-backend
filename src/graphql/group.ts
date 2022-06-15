import {TransactPut, TransactWriteRequest} from '@shiftcoders/dynamo-easy';
import {extendType, list, nonNull, objectType, queryType, stringArg} from 'nexus';
import {GroupModel} from '../ddb/group';
import {MembershipModel} from '../ddb/membrtship';
import {createIdFactory, createRawIdFactory, TableNames} from '../ddb/node';
import {Mutation} from './mutation';
import {Node} from './node';
import {Query} from './query';
import {Thread} from './thread';

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('groupName');
    t.nonNull.field('threads', {
      type: nonNull(list(nonNull(Thread))),
      async resolve(source, args, context) {
        const threads = await context.threadStore.query().index('groupIdIndex').wherePartitionKey(source.id).exec();
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
        id: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return context.authSource.canViewGroup(args.id);
      },
      async resolve(source, args, context) {
        const group = await context.groupDataLoader.load(args.id);
        return group ?? null;
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
        groupName: nonNull(stringArg()),
        memberships: nonNull(list(nonNull(stringArg()))),
      },
      async authorize(root, args, context) {
        return context.authSource.isAuthorized();
      },
      async resolve(source, args, context) {
        // TODO: 25アイテム以上はDynamoDBの仕様上無理なので、制限をかける
        const groupId = createIdFactory(TableNames.Group)();
        const transaction = new TransactWriteRequest();
        transaction.transact(
          new TransactPut(GroupModel, {id: groupId, groupName: args.groupName}),
        );
        for (const userId of args.memberships) {
          transaction.transact(
            new TransactPut(MembershipModel, {id: createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({userId, groupId})), groupId, userId}),
          );
        }

        await transaction.exec();
        return {
          id: groupId,
          groupName: args.groupName,
        };
      },
    });
  },
});

