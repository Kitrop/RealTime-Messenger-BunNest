import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import AuthController from './auth/auth.controller.js'
import { AuthModule } from './auth/auth.module.js'
import { AuthService } from './auth/auth.service.js'
import { PrismaService } from './prisma.service.js'

@Module({
	imports: [AuthModule],
	controllers: [AppController, AuthController],
	providers: [AppService, PrismaService, JwtService, AuthService],
})
export class AppModule {}
