import {
	IsEmail,
	IsNumber,
	IsPositive,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator'

interface IPayload {
	userID: number
	username: string
	email: string
}

export class PayloadDto {
	@IsNumber()
	@IsPositive()
	id: number

	@IsString()
	@MinLength(3)
	@MaxLength(30)
	username: string

	@IsString()
	@IsEmail()
	email: string
}

export class CreateUserDto {
	@IsString()
	@MinLength(3)
	@MaxLength(30)
	username: string

	@IsString()
	@IsEmail()
	email: string

	@IsString()
	@MinLength(5)
	@MaxLength(255)
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Пароль должен быть надежным и содержать хотя бы одну строчную букву, одну заглавную букву, одну цифру и один специальный символ',
		}
	)
	password: string
}

export class LoginUserDto {
	@IsString()
	@MinLength(3)
	@MaxLength(30)
	username: string

	@IsString()
	@MinLength(5)
	@MaxLength(255)
	password: string
}