import {kill} from 'node:process';
import {extendType, list, nonNull, objectType, stringArg} from 'nexus';
import ksuid from 'ksuid';
import {formatISO} from 'date-fns';
import {ThreadCommentModel} from '../ddb/thread-comment';
import {createIdFactory, TableNames} from '../ddb/node';
import {User} from './user';
import {Mutation} from './mutation';
import {Node} from './node';

export const ThreadComment = objectType({
  name: 'ThreadComment',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('threadId');
    t.nonNull.string('title');
    t.nonNull.string('body');
    t.nonNull.field('commentedBy', {
      type: nonNull(User),
      async authorize(root, args, context) {
        return context.authSource.isAuthorized();
      },
      async resolve(source, args, context) {
        const comment = (await context.threadCommentDataLoader.load(source.id))!;
        const user = await context.userDataLoader.load(comment.commentedBy);
        if (!user) {
          throw new Error('user not found');
        }

        return user;
      },
    });
    t.nonNull.string('commentedAt');
  },
});

export const ThreadCommentMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('createThreadComment', {
      type: ThreadComment,
      args: {
        threadId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return (context.authSource.canViewThread(args.threadId));
      },
      async resolve(source, args, context) {
        const item: ThreadCommentModel = {
          id: createIdFactory(TableNames.ThreadComment)(),
          threadId: args.threadId,
          title: args.title,
          body: args.body,
          commentedBy: (await context.authSource.userId())!,
          commentedAt: formatISO(new Date()),
        };
        await context.threadCommentStore.put(item).exec();
        return item;
      },
    });
  },
});

