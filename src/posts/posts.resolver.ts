import { Resolver, Query } from '@nestjs/graphql'
import { PostsService } from './posts.service'
import { AllPosts } from './models/post.model'

@Resolver(of => AllPosts)
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}

  @Query(returns => [AllPosts])
  async getAllPosts(): Promise<AllPosts[]> {
    const data = await this.postService.getPosts()
		console.log(data)
		return data
  }
}
