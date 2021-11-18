import { Context } from "aws-lambda";
import {DecodedIdToken} from 'firebase-admin/auth';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export interface AuthHandlerContext extends Context {user?: DecodedIdToken }

interface AuthMiddlewareRequest {
    // interface to overwrite request.context in middleware
    event: APIGatewayProxyEvent;
    context: AuthHandlerContext;
    response: APIGatewayProxyResult
    error: Error | null
    internal: {
        [key: string]: any
    }
}

export type AuthMiddlewareFn = (request: AuthMiddlewareRequest) => any
