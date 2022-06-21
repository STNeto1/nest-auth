import { Options } from '@mikro-orm/core'
import dotenv from 'dotenv'

import { User } from './user/entities/user.entity'

dotenv.config()

const config: Options = {
  entities: [User],
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  type: 'postgresql',
  debug: true,
  allowGlobalContext: true
}

export default config
