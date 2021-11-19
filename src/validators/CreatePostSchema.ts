import Joi from 'joi'

export default Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    published: Joi.boolean()
})