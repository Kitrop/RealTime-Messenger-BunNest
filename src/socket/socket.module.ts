import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthGuard } from 'src/auth/auth.guard'
import { PrismaService } from 'src/prisma.service'
import { AccessGuard } from './access.guard'
import { SocketGateway } from './socket.gateway'
import { SocketService } from './socket.service'

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
	providers: [
		SocketGateway,
		PrismaService,
		AuthGuard,
		JwtService,
		SocketService,
		AccessGuard,
	],
})
export class SocketModule {}
