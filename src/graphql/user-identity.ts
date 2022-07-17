import {TransactPut, TransactWriteRequest} from '@shiftcoders/dynamo-easy';
import {SESV2} from 'aws-sdk';
import {hash} from 'bcrypt';
import {generate} from 'generate-password';
import ksuid from 'ksuid';
import {arg, extendType, nonNull, nullable, objectType, stringArg} from 'nexus';
import {createRawIdFactory, TableNames} from '../ddb/node';
import {UserModel} from '../ddb/user';
import {UserIdentityModel} from '../ddb/user-identity';
import {getDomains} from '../util/domain';
import {kmsJwtSign, kmsVerifyJwt} from '../util/kms-jwt-sign';
import {getPassphraseConfig} from '../util/passphrase';
import {getSiteConfig} from '../util/site';
import {Mutation} from './mutation';
import {Node} from './node';
import {User} from './user';

export const UserIdentity = objectType({
  name: 'UserIdentity',
  definition(t) {
    t.implements(Node);
    t.nonNull.string('email');
    t.nonNull.string('userId');
    t.nonNull.string('passwordHash');

    t.field('user', {
      type: nullable(User),
      async resolve(source, _args, context) {
        return context.userStore.get(source.userId).exec();
      },
    });
  },
});

export const UserIdentityMutation = extendType({
  type: Mutation.name,
  definition(t) {
    t.field('resetPassword', {
      type: nonNull('Boolean'),
      args: {
        email: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return true;
      },
      async resolve(source, args, context) {
        const userIdentity = await context.userIdentityStore.get(createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: args.email}))).exec();
        const password = generate({length: 13, numbers: true, excludeSimilarCharacters: true, symbols: '#@$%', strict: true});
        const {email: emailDomain} = await getDomains();
        const ses = new SESV2();
        const parameters: SESV2.Types.SendEmailRequest = {
          FromEmailAddress: `noreply@${emailDomain}`,
          Destination: {
            ToAddresses: [args.email],
          },
          Content: {
            Simple: {
              Subject: {
                Data: 'パスワード再設定',
                // eslint-disable-next-line unicorn/text-encoding-identifier-case
                Charset: 'UTF-8',
              },
              Body: {
                Text: {
                  Data: `新しいパスワード: \n ${password}\n`,
                  // eslint-disable-next-line unicorn/text-encoding-identifier-case
                  Charset: 'UTF-8',
                },
              },
            },
          },
        };
        const passwordHash = await hash(password, 10);

        if (userIdentity) {
          await context.userIdentityStore.update(userIdentity.id).updateAttribute('passwordHash').set(passwordHash).exec();

          if (args.email.endsWith('example.com')) {
            console.info('reset params', parameters);
            return true;
          }

          const result = await ses.sendEmail(parameters).promise();
          return Boolean(result.MessageId);
        }

        return true; // メールがあってもなくてもあったふりをする
      },
    });

    t.field('initiateSignup', {
      type: nonNull('Boolean'),
      args: {
        email: nonNull(stringArg()),
        passphrase: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return true;
      },
      async resolve(source, args, context) {
        const userIdentity = await context.userIdentityStore.get(createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: args.email}))).exec();
        const passphrase = await getPassphraseConfig();

        if (args.passphrase.trim() !== passphrase.signup) {
          return false;
        }

        if (userIdentity) {
          return true; // ユーザーが存在した場合も適当に
        }

        const signupToken = await kmsJwtSign({email: args.email, purpose: 'signup'}, 'alias/auth-development');
        const {email: emailDomain, web: webDomain} = await getDomains();
        const config = await getSiteConfig();

        const ses = new SESV2();
        const parameters: SESV2.Types.SendEmailRequest = {
          FromEmailAddress: `noreply@${emailDomain}`,
          Destination: {
            ToAddresses: [args.email],
          },
          Content: {
            Simple: {
              Subject: {
                Data: `【${config.title}】ユーザー登録`,
                // eslint-disable-next-line unicorn/text-encoding-identifier-case
                Charset: 'UTF-8',
              },
              Body: {
                Text: {
                  Data: `次のURLをブラウザで開き、会員登録を完了させてください\nhttps://${webDomain}/signup3?token=${signupToken}`,
                  // eslint-disable-next-line unicorn/text-encoding-identifier-case
                  Charset: 'UTF-8',
                },
              },
            },
          },
        };
        if (args.email.endsWith('example.com')) {
          console.info('signup email params', parameters);
          return true;
        }

        const result = await ses.sendEmail(parameters).promise();
        return Boolean(result.MessageId);
      },
    });

    t.field('signup', {
      type: nonNull('Boolean'),
      args: {
        token: nonNull(stringArg()),
        userName: nonNull(stringArg()),
        userTitle: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async authorize(root, args, context) {
        return true;
      },
      async resolve(source, args, context) {
        const verified = await kmsVerifyJwt(args.token, 'signup', 'alias/auth-development');
        const userIdentity = await context.userIdentityStore.get(createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: verified.email}))).exec();

        if (userIdentity) {
          return false;
        }

        const userId = createRawIdFactory(TableNames.User)(ksuid.randomSync().toString());
        const userIdentityId = createRawIdFactory(TableNames.UserIdentity)(UserIdentityModel.combinedId({email: verified.email}));
        const transaction = new TransactWriteRequest();
        transaction.transact(new TransactPut(UserModel, {
          id: userId,
          userName: args.userName,
          userTitle: args.userTitle,
        }));

        transaction.transact(new TransactPut(
          UserIdentityModel,
          {
            id: userIdentityId,
            userId,
            email: verified.email as string,
            passwordHash: await hash(args.password, 10),
          },
        ));

        await transaction.exec();

        return true;
      },
    });
  },
});

