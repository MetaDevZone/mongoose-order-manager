const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const max_order_validator = async (modelName, query_obj, order_field) => {
  const schema = Joi.object({
    modelName: Joi.any().required(),
    query_obj: Joi.object(),
    order_field: Joi.string().required(),
  });
  return schema.validate({ modelName, query_obj, order_field });
};

const change_order_validator = (
  _id,
  current_order,
  past_order,
  modelName,
  query_obj,
  order_field
) => {
  const schema = Joi.object({
    _id: Joi.any()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    current_order: Joi.number().required().min(1),
    past_order: Joi.number().required(),
    modelName: Joi.any().required(),
    query_obj: Joi.object(),
    order_field: Joi.string().required(),
  });
  return schema.validate({
    _id,
    current_order,
    past_order,
    modelName,
    query_obj,
    order_field,
  });
};

const change_delete_order_validator = (
  _id,
  current_order,
  modelName,
  query_obj,
  order_field
) => {
  const schema = Joi.object({
    _id: Joi.any()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    current_order: Joi.number().required().min(1),
    modelName: Joi.any().required(),
    query_obj: Joi.object(),
    order_field: Joi.string().required(),
  });
  return schema.validate({
    _id,
    current_order,
    modelName,
    query_obj,
    order_field,
  });
};

const reoder_validator = (modelName, query_obj, order_field) => {
  const schema = Joi.object({
    modelName: Joi.any().required(),
    query_obj: Joi.object(),
    order_field: Joi.string().required(),
  });
  return schema.validate({
    modelName,
    query_obj,
    order_field,
  });
};

module.exports = {
  max_order_validator,
  change_order_validator,
  change_delete_order_validator,
  reoder_validator,
};
