import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional, MinLength } from 'class-validator'

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string

  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string

  @IsOptional()
  @MinLength(4)
  @Field(() => String, { nullable: true })
  password?: string
}
