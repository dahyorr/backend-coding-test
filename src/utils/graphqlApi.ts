import { hashuraEndpoint } from "./config";
import { GraphQLClient } from 'graphql-request'

const graphQLClient = new GraphQLClient(hashuraEndpoint, {
    headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        'content-type': 'application/json'
    } 
})

export const sendDatabaseQuery = async (query: string) => await graphQLClient.request(query)