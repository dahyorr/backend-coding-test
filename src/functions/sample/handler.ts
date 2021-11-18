import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import firebaseAuth from '@middlewares/firebaseAuth'
import { AuthHandlerContext } from 'src/types'


async function sample (event: APIGatewayProxyEvent, context: AuthHandlerContext): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'it works',
            event,
            context
        })
    }
}

export const main = middy(sample)
    .use(firebaseAuth())

