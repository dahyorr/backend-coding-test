import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { AuthHandlerContext } from 'src/types';
import schema from './schema';
import CreatePostSchema from '@validators/CreatePostSchema';

import bodyValidator from '@middlewares/bodyValidator';
import firebaseAuth from '@middlewares/firebaseAuth';
import httpErrorHandler from '@middy/http-error-handler';

import { gql } from 'graphql-request'
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage, InvalidAuthor, InvalidPostId, PostNotFound } from '@utils/customErrors';

const updateBlogPost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context: AuthHandlerContext)=> {
    const {title, content, published} = event.body
    let {postId} = event.pathParameters
    const id = parseInt(postId)
    if (!id){
        throw InvalidPostId
    }

    // check if post is valid and user is author
    const initialQuery = gql`
    query GetPostAuthor {
        posts_by_pk(id: ${id}) {
            authorId
        }
    }
    `
    const {posts_by_pk} = await sendDatabaseQuery(initialQuery) as {'posts_by_pk': {
        [key: string] : any
    }}

    if(!posts_by_pk){
        throw PostNotFound
    }
    else if(posts_by_pk.authorId !== context.user.uid){
        throw InvalidAuthor
    }

    const query = gql`
    mutation UpdatePost {
        update_posts_by_pk(pk_columns: {id: ${id}}, _set: {
            title: "${title}", 
            content: ${content}, 
            published: ${Boolean(published)}
        }) {
            id
            title
            content
            published
            lastUpdated
            createdAt
            author {
                name
            }
        }
    }
    `
    const {update_posts_by_pk} = await sendDatabaseQuery(query) as {'update_posts_by_pk': {
        [key: string] : any
    }}
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            message: "Post Updated successfully",
            details: update_posts_by_pk
        }
    )}
}

export const main = middyfy(updateBlogPost)
    .use(firebaseAuth({isAdmin: true}))
    .use(bodyValidator(CreatePostSchema))
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))