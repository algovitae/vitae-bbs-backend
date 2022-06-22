import {SESV2} from 'aws-sdk';
import {hash, hashSync} from 'bcrypt';
import {generate} from 'generate-password';
import {arg, extendType, nonNull, nullable, objectType, stringArg} from 'nexus';
import {createRawIdFactory, TableNames} from '../ddb/node';
import {UserIdentityModel} from '../ddb/user-identity';
import {getDomains} from '../util/domain';
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
  },
});

