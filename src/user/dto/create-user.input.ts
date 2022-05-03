import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string

  @IsNotEmpty()
  @MinLength(4)
  @Field(() => String)
  password: string
}
