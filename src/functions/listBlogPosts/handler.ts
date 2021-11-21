import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import httpErrorHandler from '@middy/http-error-handler';

import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage } from '@utils/customErrors';
import { getPostsQuery } from '@graphql/queries';
import { QueryRoot } from '@types';

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

    const {posts} = await sendDatabaseQuery<QueryRoot>(getPostsQuery, {after, count})
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            posts
        }
    )}
}

export const main = middyfy(listBlogPosts)
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))

