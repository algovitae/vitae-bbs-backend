import {nonNull, objectType} from 'nexus';
import {User} from './user';

export const ThreadComment = objectType({
  name: 'ThreadComment',
  definition(t) {
    t.nonNull.id('thread_id');
    t.nonNull.id('comment_id');
    t.nonNull.string('title');
    t.nonNull.string('body');
    t.nonNull.field('commented_by', {
      type: nonNull(User),
      async resolve(source, args, context) {
        return context.userDataLoader.load(source.commented_by);
      },
    });
    t.nonNull.string('commented_at');
  },
});

