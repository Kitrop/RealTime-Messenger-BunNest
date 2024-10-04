import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { NoAuthGuard } from './noAuth.guard'
import { AuthGuard } from './auth.guard'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, PrismaService, NoAuthGuard, AuthGuard]
})
export class AuthModule {}
