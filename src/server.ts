import { ApolloServer } from 'apollo-server'
import { AppContext } from './graphql/context/AppContext'
import { schema } from './schema'
export const server = new ApolloServer({ schema, context: ({req, res}) => {
    const authorization = req.headers.authorization
    const base64token = authorization?.split(" ").at(1)
    const token = base64token ? Buffer.from(base64token, 'base64').toString('utf-8') : undefined
    return new AppContext(token)
} })
