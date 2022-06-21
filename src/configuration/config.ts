import * as Joi from 'joi'

export const configValidationSchema = Joi.object({
  SES_REGION: Joi.string(),
  AWS_ACCESS_KEY: Joi.string(),
  AWS_SECRET_KEY: Joi.string(),
  SES_SOURCE_MAIL: Joi.string(),
  DB_HOST: Joi.string(),
  DB_NAME: Joi.string(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_PORT: Joi.number()
})
