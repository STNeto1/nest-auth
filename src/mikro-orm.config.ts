import { Options } from '@mikro-orm/core'

import { User } from './user/entities/user.entity'

const config: Options = {
  entities: [User],
  dbName: 'nest1',
  user: 'postgres',
  password: 'postgres',
  type: 'postgresql',
  port: 5432,
  debug: true
}

export default config
