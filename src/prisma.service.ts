import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async checkExistChat(id: number) {
    const chat = this.chat.findUnique({
      where: {
        id
      }
    })
    
    if (chat) {
      return true
    } else {
      return false
    }
  }

  async checkExistUser(id: number) {
    const user = this.user.findUnique({
      where: {
        id
      }
    })

    if (user) {
      return true
    } else {
      return false
    }
  }
}
