import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { PrismaService } from 'src/prisma.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { SocketService } from './socket.service';
import { AccessGuard } from './access.guard'

@Module({
  imports: [   
		ConfigModule.forRoot(),
		JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h',
      },
    }),
	],
  providers: [SocketController, PrismaService, AuthGuard, JwtService, SocketService, AccessGuard]
})
export class SocketModule {}
