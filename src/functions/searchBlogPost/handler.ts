import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import httpErrorHandler from '@middy/http-error-handler';

import { defaultFallbackMessage, NoSearchQuery } from '@utils/customErrors';
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { gql } from 'graphql-request'

const searchBlogPost = async (event: APIGatewayProxyEvent)=> {
    let searchQuery = ''
    if(event.queryStringParameters){
        searchQuery = event.queryStringParameters.query
    }
    if (!searchQuery){
        throw NoSearchQuery
    }
    const query = gql`
    query SearchPosts {
        posts(where: {_or: [{title: {_ilike: "%${searchQuery}%"}}, {content: {_ilike: "%${searchQuery}%"}}]}) {
            id
            title
        }
    }
    `
    const {posts} = await sendDatabaseQuery(query) as {'posts': {
        [key: string] : any
    }}
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            data: posts
        }
    )}
}

export const main = middyfy(searchBlogPost)
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))

