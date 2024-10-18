import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { CreatePostDto, DeletePostDto, EditPostDto } from 'src/dto/post.dto'
import { InvalidDataException } from 'src/socket/error-message.exception'

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: CreatePostDto) {
    const { authorId, content } = data

    return this.prisma.post.create({
      data: {
        content,
        author: { connect: { id: authorId } },
      },
    })
  }
  
  async editPost(data: EditPostDto) {
    const findPost = await this.prisma.post.findUnique({
      where: {
        id: data.postId
      }
    })

    if (!findPost) {
      throw new InvalidDataException('Post not found')
    }

    
    if (findPost.authorId !== data.authorId) {
      throw new InvalidDataException('You can edit only your posts')
    }

    const editedPost = await this.prisma.post.update({
      where: {
        id: data.postId
      },
      data: {
        content: data.content
      }
    })

    return editedPost
  }

  async deletePost(data: DeletePostDto) {
    const findPost = await this.prisma.post.findUnique({
      where: {
        id: data.postId
      }
    })

    if (!findPost) {
      throw new InvalidDataException('Post not found')
    }

    if (findPost.authorId !== data.authorId) {
      throw new InvalidDataException('You can delete only your posts')
    }

    const deletedPost = await this.prisma.post.delete({
      where: {
        id: data.postId
      }
    })

    return deletedPost
  }

  async getPosts() {
    return this.prisma.post.findMany({
      include: { author: true },
    })
  }
}
