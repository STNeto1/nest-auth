import * as Joi from 'joi'

export const configValidationSchema = Joi.object({
  SES_REGION: Joi.string(),
  AWS_ACCESS_KEY: Joi.string(),
  AWS_SECRET_KEY: Joi.string(),
  SES_SOURCE_MAIL: Joi.string()
})
