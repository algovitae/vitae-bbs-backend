

import {Buffer} from 'node:buffer';
import {LogInfo, updateDynamoEasyConfig} from '@shiftcoders/dynamo-easy';
import {ApolloServer} from 'apollo-server-lambda';
import {AppContext} from './graphql/context/app-context';
import {schema} from './schema';

export const server: ApolloServer = new ApolloServer({
  schema,
  context({express: {req, res}}) {
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ').at(1);
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

export const handler = server.createHandler();
