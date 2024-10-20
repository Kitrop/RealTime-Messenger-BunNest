import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service'
import type { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import type { CreateChatDto } from 'src/dto/chat.dto'

@Controller('chats')
export class ChatsController {
	constructor(private readonly chatService: ChatsService) {}

	@UseGuards(AuthGuard)
	@Post('chat')
	async createChat(@Body() body: CreateChatDto, @Req() req: Request) {
		const chat = await this.chatService.createChat(body)

		if (!chat) {
			throw new InternalServerErrorException('sorry :(')
		}

		return chat
	}
}
