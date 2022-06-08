import {resolve} from 'node:path';
import {extendType, list, nonNull, objectType, queryType} from 'nexus';
import {Group} from './group';
import {Query} from './query';

import {User} from './user';

export const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.nonNull.string('user_id');
    t.nonNull.string('group_id');

    t.field('user', {
      type: nonNull(User),
      async resolve(source, args, context) {
        const dataloader = context.userDataLoader;
        return (await dataloader.load(source.user_id))!;
      },
    });

    t.field('group', {
      type: nonNull(Group),
      async resolve(source, args, context) {
        const dataloader = context.groupDataLoader;
        return (await dataloader.load(source.group_id))!;
      },
    });
  },
});

