import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { AuthHandlerContext } from 'src/types';
import schema from './schema';
// middlewares
import bodyValidator from '@middlewares/bodyValidator';
import httpErrorHandler from '@middy/http-error-handler'
import firebaseAuth from '@middlewares/firebaseAuth';

import { gql } from 'graphql-request'
import { sendDatabaseQuery } from '@utils/graphqlApi';
import CreatePostSchema from '@validators/CreatePostSchema';
import { defaultFallbackMessage } from '@utils/customErrors';

const createBlogPost: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context: AuthHandlerContext)=> {
    const {title, content, published} = event.body
    const author = context.user.uid
    const query = gql`
    mutation CreatePost {
        insert_posts_one(object: {title: "${title}", authorId: "${author}", content: "${content}", published: ${Boolean(published)}}) {
            id
            title
            lastUpdated
            createdAt
            published
            content
            author{
                name
            }
        }
    }
    `
    const {insert_posts_one} = await sendDatabaseQuery(query) as {'insert_posts_one': {
        [key: string] : any
    }}
    
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

