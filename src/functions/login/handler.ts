import '@utils/firebase'

import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import LoginSchema from '@validators/LoginSchema';
import schema from './schema';

import bodyValidator from '@middlewares/bodyValidator';
import httpErrorHandler from '@middy/http-error-handler';

import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { defaultFallbackMessage, InvalidUser } from '@utils/customErrors';


const logIn: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event)=> {
    const {email, password} = event.body
    const auth = getAuth()

    // handle firebase auth error
    const user = await signInWithEmailAndPassword(auth, email, password)
        .then(({user}) => user)
        .catch((err)=>{
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'){
                throw InvalidUser
            }
            else{
                throw err
            }
        })

    const accessToken = await user.getIdToken(true)
    return {
        statusCode: 200,
        body: JSON.stringify({uid: user.uid, accessToken})
    }
}

export const main = middyfy(logIn)
    .use(bodyValidator(LoginSchema))
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))