import { Resolver, Query, Args, Context, type GraphQLExecutionContext, Mutation } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Chat, CreateChatInput, Message } from './chats.model'

@Resolver(() => Message)
export class ChatsResolver {
  constructor(private readonly chatService: ChatsService) {}

  // @UseGuards(AuthGuard)
  @Query(() => [Message]) // Указываем, что этот запрос возвращает массив сообщений
  async getChatMessages(
    @Args('chatId') chatId: number,
    @Context() context: any
  ) {
    const accessToken = context.req.cookies['accessToken']; // Извлекаем accessToken из куки
    return this.chatService.getMessages({ accessToken, chatId });
  }

  @Mutation(() => Chat)
  async createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Context() context: any
  ) {
    const chat = await this.chatService.createChat(createChatInput)

    if (!chat) {
      throw new InternalServerErrorException('sorry :(')
    }

    return chat
  }
}
