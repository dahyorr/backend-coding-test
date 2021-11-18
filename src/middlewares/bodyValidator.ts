import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as Joi from 'joi';

const bodyValidator = (Schema: Joi.ObjectSchema): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {

  const bodyValidatorBefore: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
    request
    ): Promise<void> => {

      try{
        const result = await Schema.validateAsync(request.event.body, {
          abortEarly: false
        })
        request.event.body = result
      }
      catch(err){
        request.response = {
          statusCode: 422,
          body: JSON.stringify({
            status: 'error',
            message: 'Invalid request Data',
            details: err.details,
          })
        }
      }
  }
  
  return {
    before: bodyValidatorBefore,
  }
}

export default bodyValidator
