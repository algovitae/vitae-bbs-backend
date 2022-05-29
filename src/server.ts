import { LogInfo, updateDynamoEasyConfig } from '@shiftcoders/dynamo-easy'
import { ApolloServer } from 'apollo-server'
import { AppContext } from './graphql/context/AppContext'
import { schema } from './schema'
export const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
        const authorization = req.headers.authorization
        const base64token = authorization?.split(" ").at(1)
        const token = base64token ? Buffer.from(base64token, 'base64').toString('utf-8') : undefined
        return new AppContext(token)
    }
})

updateDynamoEasyConfig({
    logReceiver: (logInfo: LogInfo) => {
        if (logInfo.className === 'dynamo.mapper.mapper') {
            return
        }
        const msg = `[${logInfo.level}] ${logInfo.timestamp} ${logInfo.className} (${logInfo.modelConstructor
            }): ${logInfo.message}`
        console.debug(msg, JSON.stringify(logInfo.data))
    }
})