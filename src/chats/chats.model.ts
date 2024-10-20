import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field()
  content: string; // содержание сообщения

  @Field(() => Int)
  senderId: number; // ID отправителя

  @Field(() => Int)
  chatId: number; // ID чата

  @Field()
  createdAt: Date; // дата отправки сообщения

  @Field()
  updatedAt: Date; // дата обновления сообщения
}

@InputType()
export class CreateChatInput {
  @Field({ nullable: true }) // Указываем, что это поле может быть необязательным
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => [Int]) // Указываем, что это массив чисел
  @IsArray()
  @IsNumber({}, { each: true })
  members: number[];
}

// TODO: ПЕРЕСМОТРЕТЬ
@ObjectType()
export class Chat {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true }) // Название чата может быть null для личных чатов
  name?: string;

  @Field()
  isGroup: boolean;

  @Field(() => [ChatMember]) // Указываем, что это массив участников
  members: ChatMember[];

  @Field(() => [Message]) // Указываем, что это массив сообщений
  messages: Message[];
}

// Определяем модель ChatMember
@ObjectType()
export class ChatMember {
  @Field(() => Int)
  userId: number;

  @Field()
  joinedAt: Date;
}
