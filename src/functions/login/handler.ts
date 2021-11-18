import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';
import bodyValidator from '@middlewares/bodyValidator';
import LoginSchema from '@validators/LoginSchema';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import '@utils/firebase'


const logIn: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event)=> {
    const {email, password} = event.body
    try{
        const auth = getAuth()
        const {user} = await signInWithEmailAndPassword(auth, email, password)
        const {uid} = user
        const accessToken = await user.getIdToken()
        return {
            statusCode: 200,
            body: JSON.stringify({uid, accessToken})
        }
    }catch(err){
        console.log(err)
        let statusCode = 500
        let message = err.message
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'){
            statusCode = 401
            message = 'Invalid Email/Password'
        }

        return {
            statusCode,
            body: JSON.stringify({
                status: 'error',
                message: message || 'An Error Occured'
            })
        }
    }
}

export const main = middyfy(logIn)
    .use(bodyValidator(LoginSchema))

    