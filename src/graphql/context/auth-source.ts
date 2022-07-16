
import {JwtPayload} from 'jsonwebtoken';
import {MembershipModel} from '../../ddb/membrtship';
import {createRawIdFactory, TableNames} from '../../ddb/node';
import {Membership} from '../membership';
import {kmsVerifyJwt} from '../../util/kms-jwt-sign';
import {AppContext} from './app-context';

export class AuthSource {
  verifyPromise: Promise<JwtPayload> | undefined = undefined;

  constructor(protected context: AppContext) {}

  async verifiedToken() {
    if (!this.verifyPromise) {
      this.verifyPromise = (async () => kmsVerifyJwt(this.context.rawToken!, 'auth', 'alias/auth-development'))();
    }

    return this.verifyPromise;
  }

  async userId() {
    return (await this.verifiedToken()).userId as string;
  }

  async email() {
    return (await this.verifiedToken()).email as string;
  }

  async isAuthorized() {
    return Boolean(await this.userId());
  }

  async canViewAllUsers() {
    return this.isAuthorized();
  }

  async canViewGroup(groupId: string) {
    const userId = await this.userId();
    console.log('canViewGroup', userId, groupId);
    if (!userId) {
      return false;
    }

    console.log('canViewGroup', userId, groupId);
    const membership = await this.context.membershipStore.get(createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({userId, groupId}))).exec();
    return Boolean(membership);
  }

  async canViewThread(threadId: string) {
    const userId = await this.userId();
    if (!userId) {
      return false;
    }

    const thread = await this.context.threadDataLoader.load(threadId);
    if (!thread) {
      return false;
    }

    const membership = await this.context.membershipStore.get(createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({userId, groupId: thread.groupId}))).exec();
    return Boolean(membership);
  }
}
