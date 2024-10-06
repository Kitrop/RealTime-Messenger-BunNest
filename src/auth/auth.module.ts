import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service.js'
import AuthController from './auth.controller.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { NoAuthGuard } from './noAuth.guard.js'
import { ConfigModule } from '@nestjs/config'

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
	controllers: [AuthController],
	providers: [AuthService, JwtService, PrismaService, NoAuthGuard, AuthGuard],
})
export class AuthModule {}
