import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [   
		ConfigModule.forRoot(),
		JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '300h',
      },
    }),
	],
  controllers: [ChatsController],
  providers: [ChatsService, JwtService, PrismaService]
})

export class ChatsModule {}
