import {nullable, objectType} from 'nexus';
import {Node} from './node';
import {User} from './user';

export const UserIdentity = objectType({
  name: 'UserIdentity',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('email');
    t.nonNull.string('userId');
    t.nonNull.string('passwordHash');

    t.field('user', {
      type: nullable(User),
      async resolve(source, _args, context) {
        return context.userStore.get(source.userId).exec();
      },
    });
  },
});
