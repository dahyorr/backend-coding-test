import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import httpErrorHandler from '@middy/http-error-handler';

import { defaultFallbackMessage, NoSearchQuery } from '@utils/customErrors';
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { QueryRoot } from '@types';
import { searchPostQuery } from '@graphql/queries';

const searchBlogPost = async (event: APIGatewayProxyEvent)=> {
    let searchQuery = ''
    if(event.queryStringParameters){
        searchQuery = event.queryStringParameters.query
    }
    if (!searchQuery){
        throw NoSearchQuery
    }else{
        searchQuery = `%${searchQuery}%`
    }
    
    const {posts} = await sendDatabaseQuery<QueryRoot>(searchPostQuery, {searchQuery})

    return {
        statusCode: 200,
        body: JSON.stringify({
            data: posts
        }
    )}
}

export const main = middyfy(searchBlogPost)
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))

