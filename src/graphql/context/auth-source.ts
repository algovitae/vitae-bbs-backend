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
}
