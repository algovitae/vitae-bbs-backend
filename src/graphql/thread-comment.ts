import {kill} from 'node:process';
import {extendType, list, nonNull, objectType, stringArg} from 'nexus';
import {User} from './user';
import { Mutation } from './mutation';
import { ThreadCommentModel } from '../ddb/thread-comment';
import ksuid from 'ksuid';
import { formatISO } from 'date-fns';

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



export const ThreadCommentMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('createThreadComment', {
      type: ThreadComment,
      args: {
        group_id: nonNull(stringArg()),
        thread_id: nonNull(stringArg()),
        title: nonNull(stringArg()),
        body: nonNull(stringArg())
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewThread(args.group_id, args.thread_id));
      },
      async resolve(source, args, context) {
        const item: ThreadCommentModel = {
          comment_id: (await ksuid.random()).toString(),
          thread_id: args.thread_id,
          title: args.title,
          body: args.body,
          commented_by: (await context.authSource.userId())!,
          commented_at: formatISO(new Date())
        }
        await context.threadCommentStore.put(item).exec();
        return item;
      },
    });
  },
});

