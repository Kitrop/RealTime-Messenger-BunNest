import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field()
  username: string;
}

@ObjectType()
export class AllPosts {
  @Field(type => Int)
  id: number;

  @Field()
  content: string;

  @Field(type => Int)
  authorId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(type => Author)
  author: Author;
}
