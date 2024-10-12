import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import AuthController from './auth/auth.controller.js'
import { AuthModule } from './auth/auth.module.js'
import { AuthService } from './auth/auth.service.js'
import { PrismaService } from './prisma.service.js'
import { ChatsModule } from './chats/chats.module';
import { SocketModule } from './socket/socket.module';
import { ChatsController } from './chats/chats.controller.js'
import { ConfigModule } from '@nestjs/config'
import { ChatsService } from './chats/chats.service.js'

@Module({
	imports: [
		ConfigModule.forRoot(), 
		JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h',
      },
    }),
		AuthModule, 
		ChatsModule, 
		SocketModule, 
	],
	controllers: [AuthController, ChatsController],
	providers: [PrismaService, JwtService, AuthService, ChatsService],
})
export class AppModule {}
