import middy from '@middy/core';
import { ValidationError } from '@utils/customErrors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Joi from 'joi';

const bodyValidator = (Schema: Joi.ObjectSchema): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {

	const bodyValidatorBefore: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
		request
	): Promise<void> => {

		const result = await Schema.validateAsync(request.event.body, {
			abortEarly: false
		})
			.then((result) => {
				return result
			})
			.catch(err => {
				throw ValidationError(err)
			})
		request.event.body = result
	}
	return {
		before: bodyValidatorBefore,
	}
}

export default bodyValidator
