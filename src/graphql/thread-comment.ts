import {kill} from 'node:process';
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
      async authorize(root, args, context) {
        return context.authSource.isAuthorized();
      },
      async resolve(source, args, context) {
        const comment = (await context.threadCommentDataLoader.load(source))!;
        const user = await context.userDataLoader.load(comment.commented_by);
        return user!;
      },
    });
    t.nonNull.string('commented_at');
  },
});

