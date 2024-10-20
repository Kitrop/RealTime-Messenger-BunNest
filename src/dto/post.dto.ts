import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'

// authorId: number; content: string 
export class CreatePostDto {
	@IsNumber()
	@IsPositive()
	authorId: number

	@IsString()
	@MinLength(2)
	@MaxLength(1000)
	content: string
}


export class EditPostDto {
	@IsNumber()
	@IsPositive()
	postId: number
	
	@IsNumber()
	@IsPositive()
	authorId: number

	@IsString()
	@MinLength(2)
	@MaxLength(1000)
	content: string
}

export class DeletePostDto {
	@IsNumber()
	@IsPositive()
	postId: number
	
	@IsNumber()
	@IsPositive()
	authorId: number
}