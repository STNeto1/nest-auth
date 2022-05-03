import { Options } from '@mikro-orm/core'

const config: Options = {
  entities: [],
  dbName: 'nest1',
  user: 'postgres',
  password: 'postgres',
  type: 'postgresql',
  port: 5432,
  debug: true
}

export default config
