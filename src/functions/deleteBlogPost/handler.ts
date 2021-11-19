import { middyfy } from '@libs/lambda';
import { AuthHandlerContext } from 'src/types';
import { APIGatewayProxyEvent } from 'aws-lambda';

import firebaseAuth from '@middlewares/firebaseAuth';
import httpErrorHandler from '@middy/http-error-handler'

import { gql } from 'graphql-request'
import { sendDatabaseQuery } from '@utils/graphqlApi';

import {InvalidPostId, InvalidAuthor, defaultFallbackMessage, PostNotFound} from '@utils/customErrors'

const deleteBlogPost = async (event: APIGatewayProxyEvent, context: AuthHandlerContext)=> {
    let {postId} = event.pathParameters
    const id = parseInt(postId)
    if (!id){
        throw InvalidPostId
    }

    // Get post author
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

    // check if post and author is valid
    if(!posts_by_pk){
        throw PostNotFound
    }
    else if(posts_by_pk.authorId !== context.user.uid){
        throw InvalidAuthor
    }

    // Delete post
    const query = gql`
    mutation DeletePost {
        delete_posts_by_pk(id: ${id}) {
            id
        }
    }
    `
    const {delete_posts_by_pk} = await sendDatabaseQuery(query) as {'delete_posts_by_pk': {
        [key: string] : any
    }}
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            message: `Post #${delete_posts_by_pk.id} Deleted successfully`
        }
    )}
}

export const main = middyfy(deleteBlogPost)
    .use(firebaseAuth({isAdmin: true}))
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))
