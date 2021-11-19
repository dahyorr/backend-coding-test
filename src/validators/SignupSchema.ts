import Joi from 'joi'

export default Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    dateOfBirth: Joi.date().iso().less(Date.now()).required(),
    role: Joi.string().valid('user', 'admin')
})