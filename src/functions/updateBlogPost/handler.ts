import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { AuthHandlerContext, MutationRoot, PostsInsertInput, QueryRoot } from 'src/types';
import schema from './schema';
import CreatePostSchema from '@validators/CreatePostSchema';

import bodyValidator from '@middlewares/bodyValidator';
import firebaseAuth from '@middlewares/firebaseAuth';
import httpErrorHandler from '@middy/http-error-handler';

import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage, InvalidAuthor, InvalidPostId, PostNotFound } from '@utils/customErrors';
import { getPostAuthorQuery, updatePostMutation } from '@graphql/queries';

const updateBlogPost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context: AuthHandlerContext)=> {
    const {title, content, published = false} = event.body
    let {postId} = event.pathParameters
    const id = parseInt(postId)
    if (!id){
        throw InvalidPostId
    }

    // check if post is valid and user is author
    const {posts_by_pk} = await sendDatabaseQuery<QueryRoot>(getPostAuthorQuery, {id})
    if(!posts_by_pk){
        throw PostNotFound
    }
    else if(posts_by_pk.authorId !== context.user.uid){
        throw InvalidAuthor
    }

    const post: PostsInsertInput = {
        id,
        title,
        content,
        published,
        
    }
    const {update_posts_by_pk} = await sendDatabaseQuery<MutationRoot>(updatePostMutation, post)

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