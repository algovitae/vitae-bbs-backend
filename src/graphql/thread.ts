import {objectType} from 'nexus';

export const Thread = objectType({
  name: 'Thread',
  definition(t) {
    t.nonNull.id('group_id');
    t.nonNull.id('thread_id');
    t.nonNull.string('thread_name');
  },
});

