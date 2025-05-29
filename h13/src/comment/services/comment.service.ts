import { CommentsRepository } from '../comment.repository';
import { GetResult, ServiceResult } from '../../general/index';
import {
  getArrayOfCommentViewModels,
  getCommentViewModel,
} from './comment.mapper';
import { CommentViewModel } from '../comment.data.models';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { SERVICE_CUSTOM_MSG } from '../../general/general.consts';
import { paginateResult } from '../../general/general.services';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}
  async find(id: string): Promise<ServiceResult<CommentViewModel>> {
    if (!id) {
      return { data: null, status: false };
    }
    if (!ObjectId.isValid(id)) {
      return { data: null, status: false };
    }
    const commentLikes = await this.commentsRepository.findOne(id);
    if (!commentLikes) {
      return { data: null, status: false };
    }
    const commentViewModel = getCommentViewModel(commentLikes);
    return { data: commentViewModel, status: true };
  }

  async findManyByPostId(
    postId: string,
    sortBy: string,
    sortDir: number,
    page: number,
    size: number,
  ): Promise<ServiceResult<GetResult<CommentViewModel>>> {
    if (!postId) {
      return { data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    }
    const comments = await this.commentsRepository.findManyByPostId(
      postId,
      sortBy,
      sortDir,
      page,
      size,
    );
    if (!comments) {
      return { data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    }
    const arrayOfCommentViewModels = getArrayOfCommentViewModels(comments.data);
    const paginatedResult = paginateResult(
      {
        totalCount: comments.totalCount,
        data: arrayOfCommentViewModels,
      },
      size,
      page,
    );
    return { data: paginatedResult, status: true };
  }
}
