import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';
import bodyValidator from '@middlewares/bodyValidator';
import SignupSchema from '@validators/SignupSchema';
import {getAuth} from 'firebase-admin/auth'
import { gql } from 'graphql-request'
import '@utils/firebase'
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { sendDatabaseQuery } from '@utils/graphqlApi';

const signUp: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event)=> {
    const {name, email, password, dateOfBirth, role} = event.body
    try{
        const auth = getAuth()
        const {uid} = await auth.createUser({
            email,
            password, 
            displayName: name,
        })
        await auth.setCustomUserClaims(uid, {
            role
        })
        const query = gql`
        mutation {
            insert_users_one(object: {uid: "${uid}", dateOfBirth: "${dayjs(dateOfBirth).toISOString()}", name: "${name}"}) 
            {
                name
                dateOfBirth
                uid
                createdAt
            }
        }
        `
        const res = await sendDatabaseQuery(query) as {'insert_users_one': {
            [key: string] : any
        }}
    return {
        statusCode: 201,
        body: JSON.stringify({
            status: 'success',
            message: "User created successfully",
            details: res.insert_users_one
            
        }
    )}

    }catch(err){
        console.log(err)
        let statusCode = 500
        let message = err.message
        if (err.code === 'auth/email-already-exists'){
            statusCode = 409
        }

        return {
            statusCode,
            body: JSON.stringify({
                status: 'error',
                message: message || 'An error occured'
            })
        }
    }
}

export const main = middyfy(signUp)
    .use(bodyValidator(SignupSchema))

