import {LogInfo, updateDynamoEasyConfig} from '@shiftcoders/dynamo-easy';
import {groupStore} from '../ddb/group';
import {membershipStore} from '../ddb/membrtship';
import {threadStore} from '../ddb/thread';
import {threadCommentStore} from '../ddb/thread-comment';
import {userStore} from '../ddb/user';
import {userIdentityStore} from '../ddb/user-identity';

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
    email: 'hoge@example.com',
    user_id: '29onBfWqwv90Dvlaszo0mWUSJ6x',
    password_hash: '$2a$12$60/wigMCSIg5JpHAjxHS9ukk9RIZHRD1oynlLT6ObdMQScLRq2DiG',
  }).exec();

  await userStore.put({
    user_id: '29onBfWqwv90Dvlaszo0mWUSJ6x',
    user_name: 'hoge user name',
  }).exec();

  await groupStore.put({
    group_id: '29pq9NeBysRopKer9QfBcNijQEe',
    group_name: 'group A',
  }).exec();

  await groupStore.put({
    group_id: '29pqLK8mTT2Bwcqq9NCKSoU10s4',
    group_name: 'group B',
  }).exec();

  await membershipStore.put({
    user_id: '29onBfWqwv90Dvlaszo0mWUSJ6x',
    group_id: '29pq9NeBysRopKer9QfBcNijQEe',
  }).exec();

  await membershipStore.put({
    user_id: '29onBfWqwv90Dvlaszo0mWUSJ6x',
    group_id: '29pqLK8mTT2Bwcqq9NCKSoU10s4',
  }).exec();

  await threadStore.put({
    group_id: '29pq9NeBysRopKer9QfBcNijQEe',
    thread_id: '2AH8DPDhp5g5sVbUDED1toWI0dy',
    thread_name: 'スレッド名AA',
  }).exec();

  await threadStore.put({
    group_id: '29pq9NeBysRopKer9QfBcNijQEe',
    thread_id: '2AH8DPDhp5g5sVbUDED1toWI0dy',
    thread_name: 'スレッド名AA',
  }).exec();

  await threadCommentStore.put({
    thread_id: '2AH8DPDhp5g5sVbUDED1toWI0dy',
    comment_id: '2AHBUJZ6P5Rsac1pVuHrEnh85u0',
    title: 'title 1',
    body: 'hello',
    commented_by: '29onBfWqwv90Dvlaszo0mWUSJ6x',
    commented_at: '2022-06-08T02:50:10+0000',
  }).exec();

  await threadCommentStore.put({
    thread_id: '2AH8DPDhp5g5sVbUDED1toWI0dy',
    comment_id: '2AHBYbn51jRfBMYWHtp23D0fWQo',
    title: 'title 2',
    body: 'world',
    commented_by: '29onBfWqwv90Dvlaszo0mWUSJ6x',
    commented_at: '2022-06-08T02:50:20+0000',
  }).exec();

  console.log('seeded');
}

seed().catch(console.error);

