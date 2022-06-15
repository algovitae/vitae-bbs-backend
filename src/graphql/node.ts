import {interfaceType} from 'nexus';
import {TableIdPrefixes} from '../ddb/node';
import {Group} from './group';
import {Membership} from './membership';
import {Thread} from './thread';
import {ThreadComment} from './thread-comment';
import {User} from './user';
import {UserIdentity} from './user-identity';

export const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.nonNull.id('id', {description: 'unique identifier for the resource'});
  },
  resolveType(source) {
    if (!source) {
      return null;
    }

    const prefixMatched = source.id?.match(/(.+)::.+/);
    if (!prefixMatched) {
      return null;
    }

    const prefix = prefixMatched[1];
    switch (prefix) {
      case TableIdPrefixes.Group:
        return Group.name;
      case TableIdPrefixes.Membership:
        return Membership.name;
      case TableIdPrefixes.Thread:
        return Thread.name;
      case TableIdPrefixes.ThreadComment:
        return ThreadComment.name;
      case TableIdPrefixes.User:
        return User.name;
      case TableIdPrefixes.UserIdentity:
        return UserIdentity.name;
      default:
        return null;
    }
  },
});
