import 'dayjs/locale/en';
import '@utils/firebase'

import { middyfy } from '@libs/lambda';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';
import SignupSchema from '@validators/SignupSchema';

import bodyValidator from '@middlewares/bodyValidator';
import httpErrorHandler from '@middy/http-error-handler';

import {getAuth} from 'firebase-admin/auth'
import dayjs from 'dayjs';
import { sendDatabaseQuery } from '@utils/graphqlApi';
import { defaultFallbackMessage, EmailInUse } from '@utils/customErrors';
import { MutationRoot, UsersInsertInput } from '@types';
import { createUserProfileMutation } from '@graphql/queries';

const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event)=> {
    const {name, email, password, dateOfBirth} = event.body
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
                throw err
            }
        })
    await auth.setCustomUserClaims(uid, {role: 'user'})

    const userProfile: UsersInsertInput = {
        uid,
        name,
        dateOfBirth: dayjs(dateOfBirth).toISOString()
    }

    const {insert_users_one} = await sendDatabaseQuery<MutationRoot>(createUserProfileMutation, userProfile) 

    return {
        statusCode: 201,
        body: JSON.stringify({
            status: 'success',
            message: "User Created successfully",
            details: insert_users_one
        }
    )}
}

export const main = middyfy(signup)
    .use(bodyValidator(SignupSchema))
    .use(httpErrorHandler({fallbackMessage: defaultFallbackMessage}))