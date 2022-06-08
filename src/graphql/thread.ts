import {list, nonNull, objectType} from 'nexus';
// eslint-disable-next-line import/no-cycle
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

