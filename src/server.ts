import { ApolloServer } from 'apollo-server'
import { AppContext } from './graphql/context/AppContext'
import { schema } from './schema'
export const server = new ApolloServer({ schema, context: ({req, res}) => {
    return new AppContext()
} })
