import {extendType, list, nonNull, objectType, stringArg} from 'nexus';
import {createIdFactory, TableNames} from '../ddb/node';
import {ThreadModel} from '../ddb/thread';
import {Mutation} from './mutation';
import {Node} from './node';
import {Query} from './query';

import {ThreadComment} from './thread-comment';

export const Thread = objectType({
  name: 'Thread',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('groupId');
    t.nonNull.string('threadName');
    t.nonNull.field('comments', {
      type: nonNull(list(nonNull(ThreadComment))),
      async authorize({groupId}, args, context) {
        return context.authSource.canViewGroup(groupId);
      },
      async resolve(source, args, context) {
        return context.threadCommentStore.query().index('threadIdIndex').wherePartitionKey(source.id).exec();
      },
    });
  },
});

export const ThreadQuery = extendType({
  type: Query.name,
  definition(t) {
    t.nullable.field('thread', {
      type: Thread,
      args: {
        id: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return context.authSource.canViewThread(args.id);
      },
      async resolve(source, args, context) {
        const thread = await context.threadDataLoader.load(args.id);
        if (!thread) {
          throw new Error('thread not found');
        }

        return thread;
      },
    });
  },
});

export const ThreadMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('createThread', {
      type: Thread,
      args: {
        groupId: nonNull(stringArg()),
        threadName: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewGroup(args.groupId));
      },
      async resolve(source, args, context) {
        const item: ThreadModel = {
          id: createIdFactory(TableNames.Thread)(),
          groupId: args.groupId,
          threadName: args.threadName,
        };
        await context.threadStore.put(item).exec();
        return item;
      },
    });
  },
});

