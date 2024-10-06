import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { PrismaService } from 'src/prisma.service'

@Module({
  controllers: [],
  providers: [PrismaService]
})
export class SocketModule {}
