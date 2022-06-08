import {extendType, list, nonNull, objectType, stringArg} from 'nexus';
import {Query} from './query';

import {ThreadComment} from './thread-comment';

export const Thread = objectType({
  name: 'Thread',
  definition(t) {
    t.nonNull.id('group_id');
    t.nonNull.id('thread_id');
    t.nonNull.string('thread_name');
    t.nonNull.field('comments', {
      type: nonNull(list(nonNull(ThreadComment))),
      async authorize({group_id}, args, context) {
        return context.authSource.canViewGroup(group_id);
      },
      async resolve(source, args, context) {
        return context.threadCommentStore.query().wherePartitionKey(source.thread_id).exec();
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
        group_id: nonNull(stringArg()),
        thread_id: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return context.authSource.canViewGroup(args.group_id);
      },
      async resolve(source, args, context) {
        const thread = await context.threadDataLoader.load(args);
        return thread!;
      },
    });
  },
});

