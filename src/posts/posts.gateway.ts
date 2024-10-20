import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PostsService } from './posts.service';
import type { CreatePostDto, DeletePostDto, EditPostDto } from 'src/dto/post.dto'
import { InvalidDataException } from 'src/socket/error-message.exception'
import { UseGuards } from '@nestjs/common'
import { PostsGuard } from './posts.guard'

@WebSocketGateway({ cors: true,  credentials: true })
export class PostsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly postsService: PostsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createPost')
  async handleCreatePost(@MessageBody() createPostDto: string, @ConnectedSocket() client: Socket) {
		
		let bodyParse: CreatePostDto 

		try {
			bodyParse = JSON.parse(createPostDto)
		} catch(err) {
			throw new InvalidDataException(err.message)
		}

    const newPost = await this.postsService.createPost(bodyParse);

		client
			.emit('newPost', newPost)
  }

	@SubscribeMessage('editPost')
	@UseGuards(PostsGuard)
  async handleEditPost(@MessageBody() editPost: string, @ConnectedSocket() client: Socket) {
		
		let bodyParse: EditPostDto

		try {
			bodyParse = JSON.parse(editPost)
		} catch(err) {
			throw new InvalidDataException(err.message)
		}

		
    const editedPost = await this.postsService.editPost(bodyParse);
		client.emit('editPost', editedPost)
  }

	@SubscribeMessage('deletePost')
	@UseGuards(PostsGuard)
  async handleDeletePost(@MessageBody() createPostDto: string, @ConnectedSocket() client: Socket) {
		
		let bodyParse: DeletePostDto 

		try {
			bodyParse = JSON.parse(createPostDto)
		} catch(err) {
			throw new InvalidDataException(err.message)
		}

    const deletedPost = await this.postsService.deletePost(bodyParse);

		client
			.emit('deletePost', deletedPost)
  }
}