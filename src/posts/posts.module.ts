import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma.service'
import { PostsGateway } from './posts.gateway'
import { PostsGuard } from './posts.guard'
import { JwtService } from '@nestjs/jwt'
import { PostsResolver } from './posts.resolver'

@Module({
  providers: [PostsGateway, PostsService, PrismaService, PostsGuard, JwtService, PostsResolver],
})
export class PostsModule {}
