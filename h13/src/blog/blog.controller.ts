import {
  CUSTOM_MSG,
  HTTP_STATUS,
  SERVICE_CUSTOM_MSG,
} from '../general/general.consts';
import { BlogService } from './services/blog.service';
import { PostService } from '../post/services/post.service';
import { Response } from 'express';
import { PostInputModel } from '../post/post.data.models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BlogInputModel } from './blog.data.models';
@Controller('blogs')
export class BlogController {
  constructor(
    protected blogsService: BlogService,
    protected postsService: PostService,
  ) {}
  @Get()
  async getAll(@Query() query: any, @Res() resp: Response) {
    try {
      const blogs = await this.blogsService.findMany(
        query.searchNameTerm as string,
        query.sortBy as string,
        Number(query.sortDirection),
        Number(query.pageNumber),
        Number(query.pageSize),
      );
      return resp.status(HTTP_STATUS.OK).json(blogs.data);
    } catch (error) {
      console.error('Error in BlogController getAll:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Get(':id')
  async getById(@Param('id') blogId: string, @Res() resp: Response) {
    try {
      const blog = await this.blogsService.findOneById(blogId);

      if (blog.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
        resp.status(HTTP_STATUS.NOT_FOUND).end();
        return;
      }

      return resp.status(HTTP_STATUS.OK).json(blog.data);
    } catch (error) {
      console.error('Error in BlogController getById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Delete(':id')
  async deleteById(@Param('id') blogId: string, @Res() resp: Response) {
    try {
      const deletedBlogId = await this.blogsService.deleteOneById(blogId);
      if (deletedBlogId.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
        return resp.status(HTTP_STATUS.NOT_FOUND).end();
      }
      return resp.status(HTTP_STATUS.NO_CONTENT).end();
    } catch (error) {
      console.error('Error in BlogController deleteById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Put(':id')
  async updateById(
    @Param('id') blogId: string,
    @Body() blogDto: BlogInputModel,
    @Res() resp: Response,
  ) {
    try {
      const updatedBlog = await this.blogsService.updateOneById(
        blogId,
        blogDto,
      );
      if (updatedBlog.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
        return resp.status(HTTP_STATUS.NOT_FOUND).end();
      }
      return resp.status(HTTP_STATUS.NO_CONTENT).end();
    } catch (error) {
      console.error('Error in BlogController updateById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Post()
  async create(@Body() blogDto: BlogInputModel, @Res() resp: Response) {
    try {
      const blog = await this.blogsService.create(blogDto);
      if (!blog.status) {
        return resp.status(HTTP_STATUS.SERVER_ERROR).end();
      }
      return resp.status(HTTP_STATUS.CREATED).json(blog.data);
    } catch (error) {
      console.error('Error in BlogController getById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Post(':blogId/posts')
  async createPost(
    @Param('id') blogId: string,
    @Body() postDto: any,
    @Res() resp: Response,
  ) {
    try {
      const postData: PostInputModel = { ...postDto, blogId };
      const post = await this.postsService.createNew(postData);
      if (post.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
        return resp.status(HTTP_STATUS.NOT_FOUND).end();
      }

      return resp.status(HTTP_STATUS.CREATED).json(post.data);
    } catch (error) {
      console.error('Error in BlogController getById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Get(':blogId/posts')
  async getPostById(
    @Param('id') blogId: string,
    @Query() requestQuery,
    @Res() resp: Response,
  ) {
    try {
      const posts = await this.postsService.findByBlogId(
        blogId,
        requestQuery.sortBy as string,
        Number(requestQuery.sortDirection),
        Number(requestQuery.pageNumber as string),
        Number(requestQuery.pageSize as string),
        requestQuery.userId,
      );
      if (posts.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
        return resp.status(HTTP_STATUS.NOT_FOUND).end();
      }

      return resp.status(HTTP_STATUS.OK).json(posts.data);
    } catch (error) {
      console.error('Error in BlogController getById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }
}
