import {
	IsNumber,
	IsPositive,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'

export class SendMessageDto {
	@IsNumber()
	@IsPositive()
	chatId: number

	@IsString()
	@MinLength(1)
	@MaxLength(2000)
	content: string

	@IsNumber()
	@IsPositive()
	senderId: number
}

export class EditMessageDto {
	@IsNumber()
	@IsPositive()
	messageId: number

	@IsString()
	@MinLength(1)
	@MaxLength(2000)
	newContent: string

	@IsNumber()
	@IsPositive()
	senderId: number

	@IsNumber()
	@IsPositive()
	chatId: number
}