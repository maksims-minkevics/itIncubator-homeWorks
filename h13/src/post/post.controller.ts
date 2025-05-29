import { Response } from 'express';
import {
  CUSTOM_MSG,
  HTTP_STATUS,
  SERVICE_CUSTOM_MSG,
} from '../general/general.consts';
import { PostService } from './services/post.service';
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
import { PostInputModel } from './post.data.models';
import { CommentsService } from '../comment/services/comment.service';

@Controller('posts')
export class PostController {
  constructor(
    protected postsService: PostService,
    protected commentsService: CommentsService,
  ) {}

  @Get()
  async getAll(@Query() postsQuery, @Res() res: Response) {
    try {
      const posts = await this.postsService.find(
        postsQuery.sortBy as string,
        Number(postsQuery.sortDirection),
        Number(postsQuery.pageNumber),
        Number(postsQuery.pageSize),
      );
      return res.status(HTTP_STATUS.OK).json(posts.data);
    } catch (error) {
      console.error('❌ PostController. Error in getAll:', error);
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Get(':id')
  async getById(@Param('id') postId: string, @Res() res: Response) {
    try {
      const post = await this.postsService.findById(postId);

      if (!post.status) {
        return res.status(HTTP_STATUS.NOT_FOUND).end();
      }
      return res.status(HTTP_STATUS.OK).json(post.data);
    } catch (error) {
      console.error('❌ PostController. Error in getById:', error);
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Delete(':id')
  async deleteById(@Param('id') postId: string, @Res() res: Response) {
    try {
      const isDeleted = await this.postsService.deleteById(postId);
      if (!isDeleted.status) {
        return res.status(HTTP_STATUS.NOT_FOUND).end();
      }
      return res.status(HTTP_STATUS.NO_CONTENT).end();
    } catch (error) {
      console.error('❌ PostController. Error in deleteById:', error);
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Put(':id')
  async updateById(
    @Param('id') postId: string,
    @Body() updateDto: PostInputModel,
    @Res() res: Response,
  ) {
    try {
      const isUpdated = await this.postsService.updateById(postId, updateDto);
      if (!isUpdated.status) {
        return res.status(HTTP_STATUS.NOT_FOUND).end();
      }
      return res.status(HTTP_STATUS.NO_CONTENT).end();
    } catch (error) {
      console.error('❌ PostController. Error in updateById:', error);
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Post()
  async create(@Body() createDto: PostInputModel, @Res() res: Response) {
    try {
      const post = await this.postsService.createNew(createDto);
      if (!post.status) {
        return res.status(HTTP_STATUS.BAD_REQUEST).end();
      }
      return res.status(HTTP_STATUS.CREATED).json(post.data);
    } catch (error) {
      console.error('❌ PostController. Error in create:', error);
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }

  @Get(':id/comments')
  async getCommentsByPostId(
    @Param('id') postId: string,
    @Query() commentQuery,
    @Res() res: Response,
  ) {
    try {
      const comments = await this.commentsService.findManyByPostId(
        postId,
        commentQuery.sortBy as string,
        Number(commentQuery.sortDirection),
        Number(commentQuery.pageNumber),
        Number(commentQuery.pageSize),
      );

      if (comments.msg === SERVICE_CUSTOM_MSG.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).end();
      }

      return res.status(HTTP_STATUS.OK).json(comments.data);
    } catch (error) {
      console.error('❌ PostController. Error in getComments:', error);
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }
}
