const Joi = require("joi");
const {
  Types: { objectId },
} = require("mongoose");

const replace = async (ctx) => {
  const { id } = ctx.params;

  if (!objectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      })
    ),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string().required()),
  });
  const result = Joi.validate(ctx.requeest.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
};
