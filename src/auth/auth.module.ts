import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service.js'
import AuthController from './auth.controller.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { NoAuthGuard } from './noAuth.guard.js'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtService, PrismaService, NoAuthGuard, AuthGuard],
})
export class AuthModule {}
