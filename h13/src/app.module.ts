import { Module } from '@nestjs/common';
import { BlogRepository } from './blog/blog.repository';
import { BlogService } from './blog/services/blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogSchema } from './blog/schemas/blog.schema';
import { Posts, PostsSchema } from './post/schemas/post.schemas';
import { PostsLikes, PostsLikeSchema } from './post/schemas/postlike.schema';
import { PostController } from './post/post.controller';
import { BlogController } from './blog/blog.controller';
import { TestingController } from './testing/testing.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGOOSE_URL || 'mongodb://Slocalhost:27017',
    ),
    MongooseModule.forFeature([{ name: Blogs.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    MongooseModule.forFeature([
      { name: PostsLikes.name, schema: PostsLikeSchema },
    ]),
  ],
  controllers: [PostController, BlogController, TestingController],
  providers: [BlogRepository, BlogService],
})
export class AppModule {}
