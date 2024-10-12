import { IsArray, IsJWT, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class GetMessageDto {
	@IsString()
	@IsJWT()
	accessToken: string

	@IsNumber()
	@IsPositive()
	chatId: number
}


export class CreateChatDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsArray()
  @IsNumber({}, { each: true })
  members: number[]
}