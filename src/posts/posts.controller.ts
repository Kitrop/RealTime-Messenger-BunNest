import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
	constructor(private readonly postService: PostsService) {}

	@Get('posts')
	async getAllPosts() {
		return await this.postService.getPosts()
	}
}
