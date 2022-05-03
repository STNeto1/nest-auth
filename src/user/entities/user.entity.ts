import { ObjectType } from '@nestjs/graphql'
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@ObjectType()
@Entity({
  tableName: 'users'
})
export class User {
  @PrimaryKey({
    autoincrement: true,
    type: Number
  })
  id: number

  @Property()
  name: string

  @Property({
    unique: true
  })
  email: string

  @Property({})
  password: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()
}
