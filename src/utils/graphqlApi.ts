import { hashuraEndpoint } from "./config";
import { GraphQLClient } from 'graphql-request'
import { Variables } from "graphql-request/dist/types";

const graphQLClient = new GraphQLClient(hashuraEndpoint, {
    headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        'content-type': 'application/json'
    } 
})

export const sendDatabaseQuery = async <T>(query: string, variables: Variables=null) => await graphQLClient.request<T>(query, variables)