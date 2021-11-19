import { Context } from "aws-lambda";
import {DecodedIdToken} from 'firebase-admin/auth';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type Role = 'admin' | 'user'

export interface DecodedIdTokenWithClaims extends DecodedIdToken{
    role: Role
};

export interface AuthHandlerContext extends Context {user?: DecodedIdTokenWithClaims }

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


export interface BlogPost{
    title: string;
    content?: string;
    createdAt?: string;
    lastUpdated?: string;
    author?: string;
    id?: number;
    published?: boolean;
}