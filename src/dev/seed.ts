import {LogInfo, updateDynamoEasyConfig} from '@shiftcoders/dynamo-easy';
import {groupStore} from '../ddb/group';
import {MembershipModel, membershipStore} from '../ddb/membrtship';
import {createRawIdFactory, TableNames} from '../ddb/node';
import {threadStore} from '../ddb/thread';
import {threadCommentStore} from '../ddb/thread-comment';
import {userStore} from '../ddb/user';
import {UserIdentityModel, userIdentityStore} from '../ddb/user-identity';

async function seed() {
  updateDynamoEasyConfig({
    logReceiver(logInfo: LogInfo) {
      if (logInfo.className === 'dynamo.mapper.mapper') {
        return;
      }

      const message = `[${logInfo.level}] ${logInfo.timestamp} ${logInfo.className} (${logInfo.modelConstructor
      }): ${logInfo.message}`;
      console.debug(message, logInfo.data);
    },
  });

  await userIdentityStore.put({
    id: createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: 'hoge@example.com'})),
    email: 'hoge@example.com',
    userId: createRawIdFactory(TableNames.User)('29onBfWqwv90Dvlaszo0mWUSJ6x'),
    passwordHash: '$2a$12$60/wigMCSIg5JpHAjxHS9ukk9RIZHRD1oynlLT6ObdMQScLRq2DiG',
  }).exec();

  await userStore.put({
    id: createRawIdFactory(TableNames.User)('29onBfWqwv90Dvlaszo0mWUSJ6x'),
    userName: 'hoge user name',
    userTitle: '部長',
  }).exec();

  await userIdentityStore.put({
    id: createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: 'hoge2@example.com'})),
    email: 'hoge2@example.com',
    userId: createRawIdFactory(TableNames.User)('2Am6U2A05qGJDPtPUSdtQOlar85'),
    passwordHash: '$2a$12$60/wigMCSIg5JpHAjxHS9ukk9RIZHRD1oynlLT6ObdMQScLRq2DiG',
  }).exec();

  await userStore.put({
    id: createRawIdFactory(TableNames.User)('2Am6U2A05qGJDPtPUSdtQOlar85'),
    userName: 'user2',
    userTitle: '部長',
  }).exec();

  await userIdentityStore.put({
    id: createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: 'vitaealgo@gmail.com'})),
    email: 'vitaealgo@gmail.com',
    userId: createRawIdFactory(TableNames.User)('2AvLB4jUIGRKJifWuzAIfTFxzpW'),
    passwordHash: '$2a$12$60/wigMCSIg5JpHAjxHS9ukk9RIZHRD1oynlLT6ObdMQScLRq2DiG',
  }).exec();

  await userStore.put({
    id: createRawIdFactory(TableNames.User)('2AvLB4jUIGRKJifWuzAIfTFxzpW'),
    userName: 'vitae algo',
    userTitle: '部長',
  }).exec();

  await groupStore.put({
    id: createRawIdFactory(TableNames.Group)('29pq9NeBysRopKer9QfBcNijQEe'),
    groupName: 'group A',
  }).exec();

  await groupStore.put({
    id: createRawIdFactory(TableNames.Group)('29pqLK8mTT2Bwcqq9NCKSoU10s4'),
    groupName: 'group B',
  }).exec();

  await membershipStore.put({
    id: createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({
      userId: createRawIdFactory(TableNames.User)('29onBfWqwv90Dvlaszo0mWUSJ6x'),
      groupId: createRawIdFactory(TableNames.Group)('29pq9NeBysRopKer9QfBcNijQEe')})),
    userId: createRawIdFactory(TableNames.User)('29onBfWqwv90Dvlaszo0mWUSJ6x'),
    groupId: createRawIdFactory(TableNames.Group)('29pq9NeBysRopKer9QfBcNijQEe'),
  }).exec();

  await membershipStore.put({
    id: createRawIdFactory(TableNames.Membership)(MembershipModel.combinedId({
      userId: createRawIdFactory(TableNames.User)('29onBfWqwv90Dvlaszo0mWUSJ6x'),
      groupId: createRawIdFactory(TableNames.Group)('29pqLK8mTT2Bwcqq9NCKSoU10s4'),
    })),
    userId: createRawIdFactory(TableNames.User)('29onBfWqwv90Dvlaszo0mWUSJ6x'),
    groupId: createRawIdFactory(TableNames.Group)('29pqLK8mTT2Bwcqq9NCKSoU10s4'),
  }).exec();

  console.log('seeded');
}

seed().catch(console.error);
