// eslint-disable-next-line import/no-cycle
import {AppContext} from './app-context';

export class AuthSource {
  constructor(protected context: AppContext) {}

  async userId() {
    const token = this.context.rawToken;
    if (!token) {
      return undefined;
    }

    return JSON.parse(token).user_id as string;
  }

  async email() {
    const token = this.context.rawToken;
    if (!token) {
      return undefined;
    }

    return JSON.parse(token).email as string;
  }

  async isAuthorized() {
    return Boolean(await this.userId());
  }

  async canViewAllUsers() {
    return this.isAuthorized();
  }

  async canViewGroup(group_id: string) {
    const userId = await this.userId();
    if(!userId) {
      return false;
    }
    console.log('canViewGroup', userId, group_id);
    const membrtship = await this.context.membershipStore.get(userId, group_id).exec();
    return !!membrtship;
  }

  async canViewThread(group_id: string, thread_id: string) {
    const userId = await this.userId();
    if(!userId) {
      return false;
    }
    const thread = await this.context.threadDataLoader.load({group_id, thread_id});
    if (!thread) {
      return false;
    }
    const membrtship = await this.context.membershipStore.get(userId, thread.group_id).exec();
    return !!membrtship;
  }
}
