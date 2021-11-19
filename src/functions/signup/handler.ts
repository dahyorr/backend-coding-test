import 'dayjs/locale/en';
import '@utils/firebase'

import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';
import SignupSchema from '@validators/SignupSchema';

import bodyValidator from '@middlewares/bodyValidator';
import httpErrorHandler from '@middy/http-error-handler';

import {getAuth} from 'firebase-admin/auth'
import { gql } from 'graphql-request'
import dayjs from 'dayjs';
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage, EmailInUse } from '@utils/customErrors';

const signUp: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event)=> {
    const {name, email, password, dateOfBirth, role} = event.body
    const auth = getAuth()

    // handle firebase error
    const {uid} = await auth.createUser({
        email,
        password, 
        displayName: name,
    })
        .then((user) => user)
        .catch(err => {
            if (err.code === 'auth/email-already-exists'){
                throw EmailInUse
            }
            else{
                console.log(err)
                throw err
            }
        })
    
    await auth.setCustomUserClaims(uid, {role})
    const query = gql`
    mutation CreateUserProfile {
        insert_users_one(object: {uid: "${uid}", dateOfBirth: "${dayjs(dateOfBirth).toISOString()}", name: "${name}"}) 
        {
            name
            dateOfBirth
            uid
            createdAt
        }
    }
    `
    const {insert_users_one} = await sendDatabaseQuery(query) as {'insert_users_one': {
        [key: string] : any
    }}
    return {
        statusCode: 201,
        body: JSON.stringify({
            status: 'success',
            message: "User created successfully",
            details: insert_users_one
        }
    )}
    
}

export const main = middyfy(signUp)
    .use(bodyValidator(SignupSchema))
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))