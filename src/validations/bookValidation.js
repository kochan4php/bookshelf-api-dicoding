const Joi = require('joi');

module.exports = () => {
    return Joi.object({
        year: Joi.number().max(new Date().getFullYear()).required(),
        author: Joi.string().max(255).min(5).required(),
        summary: Joi.string().min(5).required(),
        publisher: Joi.string().max(255).min(5).required(),
        pageCount: Joi.number().required(),
        readPage: Joi.number().required(),
        reading: Joi.boolean().required()
    });
};
