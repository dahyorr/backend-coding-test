import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { AuthHandlerContext, PostsInsertInput } from 'src/types';
import schema from './schema';
// middlewares
import bodyValidator from '@middlewares/bodyValidator';
import httpErrorHandler from '@middy/http-error-handler'
import firebaseAuth from '@middlewares/firebaseAuth';

import { sendDatabaseQuery } from '@utils/graphqlApi';
import CreatePostSchema from '@validators/CreatePostSchema';
import { defaultFallbackMessage } from '@utils/customErrors';
import { createPostMutation } from '@graphql/queries';
import { MutationRoot } from '@types';

const createBlogPost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context: AuthHandlerContext)=> {
    const {title, content, published = false} = event.body
    const authorId = context.user.uid
    const post: PostsInsertInput = {
        title, 
        authorId, 
        content,
        published
    }

    const {insert_posts_one} = await sendDatabaseQuery<MutationRoot>(createPostMutation, post)
    
    return {
        statusCode: 201,
        body: JSON.stringify({
            status: 'success',
            message: "Post created successfully",
            details: insert_posts_one
        })
    }
}

export const main = middyfy(createBlogPost)
    .use(firebaseAuth({isAdmin: true}))
    .use(bodyValidator(CreatePostSchema))
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))

