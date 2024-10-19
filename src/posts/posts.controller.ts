import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
	constructor(private readonly postService: PostsService) {}

	@Get('posts')
	async getAllPosts() {
		const data: AllPosts[] = await this.postService.getPosts()
		return data
	}
}

interface AllPosts {
	author: Author
	id: number,
	content: string,
	authorId: number,
	createdAt: Date,
	updatedAt: Date
}

interface Author {
	username: string
}