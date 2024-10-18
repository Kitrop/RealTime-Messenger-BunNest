import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from 'src/prisma.service'
import { PostsGateway } from './posts.gateway'
import { PostsGuard } from './posts.guard'

@Module({
  providers: [PostsGateway, PostsService, PrismaService, PostsGuard]
})
export class PostsModule {}
