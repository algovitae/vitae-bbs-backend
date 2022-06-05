import {groupDataLoaderFactory, groupStore} from '../../ddb/group';
import {membershipStore} from '../../ddb/membrtship';
import {userDataLoaderFactory, userStore} from '../../ddb/user';
import {userIdentityStore} from '../../ddb/user-identity';
// eslint-disable-next-line import/no-cycle
import {AuthSource} from './auth-source';

export class AppContext {
  authSource = new AuthSource(this);
  constructor(protected token?: string) {}

  get rawToken() {
    return this.token;
  }

  get userStore() {
    return userStore;
  }

  get userDataLoader() {
    return userDataLoaderFactory(this.userStore);
  }

  get userIdentityStore() {
    return userIdentityStore;
  }

  get groupStore() {
    return groupStore;
  }

  get groupDataLoader() {
    return groupDataLoaderFactory(this.groupStore);
  }

  get membershipStore() {
    return membershipStore;
  }
}
