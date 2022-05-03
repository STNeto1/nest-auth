import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class JwtReturn {
  @Field(() => String)
  access_token: string
}
