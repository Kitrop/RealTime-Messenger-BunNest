import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma.service'
import { PostsGateway } from './posts.gateway'
import { PostsGuard } from './posts.guard'
import { PostsController } from './posts.controller';
import { JwtService } from '@nestjs/jwt'

@Module({
  providers: [PostsGateway, PostsService, PrismaService, PostsGuard, JwtService],
  controllers: [PostsController]
})
export class PostsModule {}
