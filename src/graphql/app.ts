import {extendType, nullable, objectType} from 'nexus';
import {getSiteConfig} from '../util/site';
import {Query} from './query';

export const App = objectType({
  name: 'App',
  definition(t) {
    t.string('title');
    t.string('maintainer');
    t.string('user_title_label');
  },
});

export const AppQuery = extendType({
  type: Query.name,
  definition(t) {
    t.field('app', {
      type: nullable(App),
      args: {},
      async resolve(source, args, context) {
        const config = await getSiteConfig();
        return config;
      },
    });
  },
});
