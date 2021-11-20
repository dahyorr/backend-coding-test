import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import httpErrorHandler from '@middy/http-error-handler';

import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage, InvalidPostId, PostNotFound } from '@utils/customErrors';
import { QueryRoot } from '@types';
import { getPostQuery } from '@graphql/queries';

const retrieveBlogPost = async (event: APIGatewayProxyEvent)=> {
    let {postId} = event.pathParameters
    const id = parseInt(postId)
    if (!id){
        throw InvalidPostId
    }

    const {posts_by_pk} = await sendDatabaseQuery<QueryRoot>(getPostQuery, {id})
    if (posts_by_pk === null){
        throw PostNotFound
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            data: posts_by_pk
        }
    )}
}

export const main = middyfy(retrieveBlogPost)
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))
