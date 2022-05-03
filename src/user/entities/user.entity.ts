import { Field, HideField, ObjectType } from '@nestjs/graphql'
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
  @Field(() => Number)
  id: number

  @Property()
  @Field(() => String)
  name: string

  @Property({
    unique: true
  })
  @Field(() => String)
  email: string

  @Property({})
  @HideField()
  password: string

  @Property()
  @Field(() => Date)
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  @Field(() => Date)
  updatedAt: Date = new Date()
}
