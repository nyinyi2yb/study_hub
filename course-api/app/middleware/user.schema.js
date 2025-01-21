const joi = require('@hapi/joi');

const schema = {
    user: joi.object({
        username: joi.string().max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        roles: joi.array()
    })
}

module.exports = schema;