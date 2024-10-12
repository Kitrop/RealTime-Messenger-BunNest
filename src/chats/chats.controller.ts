import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService, type CreateChatDto } from './chats.service'
import type { Request } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('chats')
export class ChatsController {
	constructor(private readonly chatService: ChatsService) {}

	@Post('chat')
	async createChat(@Body() body: CreateChatDto, @Req() req: Request) {
		const chat = await this.chatService.createChat(body)

		if (!chat) {
			throw new InternalServerErrorException('sorry :(')
		}

		return chat
	}

	@UseGuards(AuthGuard)
	@Get(':chatId/messages')
	async getChatMessages(@Param('chatId') chatId: string, @Req() req: Request) {
		const accessToken = req.cookies['accessToken']
		const data = await this.chatService.getMessages({ accessToken, chatId: +chatId})

		return data
	}

	@Get('all')
	async all() {
		const data = await this.chatService.allMessages()
		return data
	}
}
