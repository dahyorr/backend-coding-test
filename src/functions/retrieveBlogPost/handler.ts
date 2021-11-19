import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import httpErrorHandler from '@middy/http-error-handler';

import { gql } from 'graphql-request'
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage, InvalidPostId, PostNotFound } from '@utils/customErrors';

const retrieveBlogPost = async (event: APIGatewayProxyEvent)=> {
    let {postId} = event.pathParameters
    const id = parseInt(postId)
    if (!id){
        throw InvalidPostId
    }
    const query = gql`
    query GetPost {
        posts_by_pk(id: ${id}) {
            id
            title
            content
            published
            createdAt
            lastUpdated
            author {
                name
            }
        }
    }
    `
    const {posts_by_pk} = await sendDatabaseQuery(query) as {'posts_by_pk': {
        [key: string] : any
    }}
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
