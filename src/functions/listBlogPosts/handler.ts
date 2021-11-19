import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import httpErrorHandler from '@middy/http-error-handler';

import { gql } from 'graphql-request'
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage } from '@utils/customErrors';

const listBlogPosts = async (event: APIGatewayProxyEvent)=> {
    const queryParams = event.queryStringParameters
    let count = 5
    let after = 0
    if(queryParams && parseInt(queryParams.count)){
        count = parseInt(queryParams.count)
    }
    if(queryParams && parseInt(queryParams.after)){
        after = parseInt(queryParams.after)
    }
    const query = gql`
    query GetPosts {
        posts(limit:${count} order_by: {id: asc}  where: {id: {_gt: ${after}}}) {
            id
            title
            lastUpdated
            published
            author {
                name
            }
        }
    }
    `
    const res = await sendDatabaseQuery(query) as {posts: {
        [key: string]: any
    }}

    return {
        statusCode: 201,
        body: JSON.stringify({
            status: 'success',
            posts: res.posts
        }
    )}
}

export const main = middyfy(listBlogPosts)
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))

