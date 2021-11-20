import { middyfy } from '@libs/lambda';
import { AuthHandlerContext, MutationRoot, QueryRoot } from 'src/types';
import { APIGatewayProxyEvent } from 'aws-lambda';

import firebaseAuth from '@middlewares/firebaseAuth';
import httpErrorHandler from '@middy/http-error-handler'

import { sendDatabaseQuery } from '@utils/graphqlApi';
import {InvalidPostId, InvalidAuthor, defaultFallbackMessage, PostNotFound} from '@utils/customErrors'
import { deletePostMutation, getPostAuthorQuery } from '@graphql/queries';

const deleteBlogPost = async (event: APIGatewayProxyEvent, context: AuthHandlerContext)=> {
    let {postId} = event.pathParameters
    const id = parseInt(postId)
    if (!id){
        throw InvalidPostId
    }

    // check if post and author is valid
    const {posts_by_pk} = await sendDatabaseQuery<QueryRoot>(getPostAuthorQuery, {id})
    if(!posts_by_pk){
        throw PostNotFound
    }
    else if(posts_by_pk.authorId !== context.user.uid){
        throw InvalidAuthor
    }

    // Delete post
    const {delete_posts_by_pk} = await sendDatabaseQuery<MutationRoot>(deletePostMutation, {id})
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
