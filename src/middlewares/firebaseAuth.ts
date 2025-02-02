import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {getAuth} from 'firebase-admin/auth';
import '@utils/firebase'
import {AuthMiddlewareFn, DecodedIdTokenWithClaims } from 'src/types';
import { AdminRoleRequired, InvalidToken, NoToken, TokenExpired } from '@utils/customErrors';

const firebaseAuth = (options={isAdmin:false}): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
	const firebaseAuthBefore: AuthMiddlewareFn = async (
		request
	): Promise<void> => {

		const {headers} = request.event
		const token = headers['Authorization']

		if(!token){
		throw NoToken
		}
		
		const splitToken = token.split(' ')

		if(token && splitToken.length !== 2){
			throw InvalidToken
		}

		const auth = getAuth()
		const res = await auth.verifyIdToken(splitToken[1])
			.then((res) => res as DecodedIdTokenWithClaims)
			.catch(err => {
				if(err.code === 'app-check/invalid-argument' || err.code === `auth/argument-error`){
					throw InvalidToken
				}
				else if(err.code === 'auth/id-token-expired' ){
					throw TokenExpired
				}
				else{
					throw err
				}
			})

		if(options.isAdmin && res.role !== 'admin'){
			throw AdminRoleRequired
		}
		request.context.user = res 

	}

	return {
		before: firebaseAuthBefore,
	}
}

export default firebaseAuth
