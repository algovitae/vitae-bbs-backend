import {Buffer} from 'node:buffer';
import {LogInfo, updateDynamoEasyConfig} from '@shiftcoders/dynamo-easy';
import {ApolloServer} from 'apollo-server';
import {AppContext} from './graphql/context/app-context';
import {schema} from './schema';

export const server: ApolloServer = new ApolloServer({
  schema,
  context({req, res}) {
    const authorization = req.headers.authorization;

    const [, base64token] = authorization ? authorization.split(' ') : [undefined, undefined];
    const token = base64token ? Buffer.from(base64token, 'base64').toString('utf8') : undefined;
    return new AppContext(token);
  },
});

updateDynamoEasyConfig({
  logReceiver(logInfo: LogInfo) {
    if (logInfo.className === 'dynamo.mapper.mapper') {
      return;
    }

    const message = `[${logInfo.level}] ${logInfo.timestamp} ${logInfo.className} (${logInfo.modelConstructor
    }): ${logInfo.message}`;
    console.debug(message, JSON.stringify(logInfo.data));
  },
});

