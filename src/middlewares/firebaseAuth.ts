import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {getAuth} from 'firebase-admin/auth';
import '@utils/firebase'
import {AuthMiddlewareFn } from 'src/types';

const firebaseAuth = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {

  const firebaseAuthBefore: AuthMiddlewareFn = async (
    request
    ): Promise<void> => {

    const {headers} = request.event
    const token = headers['Authorization']
    const splitToken = token.split(' ')

    try {
      if(!token || !token.startsWith('Bearer') || splitToken.length !== 2){
        const err = new Error("No token or invalid token Provided")
        err.name = 'No Token'
        throw err
      }
      const auth = getAuth()
      const res = await auth.verifyIdToken(splitToken[1]);
      request.context.user = res 
    } 
    catch (err) {
      console.log(err)
      let statusCode = 500
      let message = err.message
      if(err.code === 'app-check/invalid-argument' || err.code === `auth/argument-error`){
        statusCode = 401
        message = 'Invalid Token'
      }
      if(err.code === 'auth/id-token-expired'){
        statusCode = 401
        message = 'Token is expired'
      }
      if(err.name === 'No Token'){
        statusCode = 401
      }

      request.response = {
        statusCode,
        body: JSON.stringify({
          status: 'error',
          message: message || 'An Error Occured'
        })
      }
    }
  }

  return {
    before: firebaseAuthBefore,
  }
}

export default firebaseAuth
