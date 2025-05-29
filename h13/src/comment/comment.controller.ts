import { Response } from 'express';
import { CUSTOM_MSG, HTTP_STATUS } from '../general/general.consts';
import { CommentsService } from './services/comment.service';
import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller('/comments')
export class CommentController {
  constructor(protected commentsService: CommentsService) {}
  @Get('/:id')
  async getById(@Param('id') commentId: string, @Res() resp: Response) {
    try {
      const comment = await this.commentsService.find(commentId);
      if (!comment.status) {
        return resp.sendStatus(HTTP_STATUS.NOT_FOUND);
      }
      return resp.status(HTTP_STATUS.OK).json(comment.data);
    } catch (error) {
      console.error('Error in CommentController getById:', error);
      return resp
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: CUSTOM_MSG.INTERNAL_SERVER_ERROR });
    }
  }
}
