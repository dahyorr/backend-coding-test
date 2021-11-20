import createHttpError from 'http-errors';
import Joi from 'joi';

export const defaultFallbackMessage = JSON.stringify({
    status: 'error',
    message: 'An error occured'
})

export const InvalidPostId = new createHttpError.NotFound(JSON.stringify({
    status: 'error',
    message: 'Invalid post Id'
}))

export const PostNotFound = new createHttpError.NotFound(JSON.stringify({
    status: 'error',
    message: 'Post not found'
}))

export const AdminRoleRequired = new createHttpError.Forbidden(JSON.stringify({
    status: 'error',
    message: 'Admin priviledges required'
}))

export const InvalidAuthor = new createHttpError.Forbidden(JSON.stringify({
    status: 'error',
    message: 'You are not the author of this post'
}))

export const InvalidUser = new createHttpError.Unauthorized(JSON.stringify({
    status: 'error',
    message: 'Invalid Email/Password'
}))

export const NoToken = new createHttpError.Unauthorized(JSON.stringify({
    status: 'error',
    message: 'No token provided'
}))

export const InvalidToken = new createHttpError.Unauthorized(JSON.stringify({
    status: 'error',
    message: 'Invalid token provided'
}))

export const TokenExpired = new createHttpError.Unauthorized(JSON.stringify({
    status: 'error',
    message: 'Token has expired'
}))

export const NoSearchQuery = new createHttpError.UnprocessableEntity(JSON.stringify({
    status: 'error',
    message: 'No search query provided'
}))

export const ValidationError = (err: Joi.ValidationError) => new createHttpError.UnprocessableEntity(JSON.stringify({
    status: 'error',
    message: 'Invalid request body',
    details: err.details
}))

export const EmailInUse = new createHttpError.Conflict(JSON.stringify({
    status: 'error',
    message: 'Email already in use'
}))
