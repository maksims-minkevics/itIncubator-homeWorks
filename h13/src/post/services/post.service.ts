import {
  PostDbInsertModel,
  PostDbModel,
  PostInputModel,
  PostViewModel,
} from '../post.data.models';
import { GetResult, ServiceResult } from '../../general/index';
import { PostsRepository } from '../post.repository';
import { paginateResult } from '../../general/general.services';
import { getArrayOfPostsViewModels, getPostViewModel } from './post.mapper';
import { SERVICE_CUSTOM_MSG } from '../../general/general.consts';
import { ObjectId } from 'mongodb';
import { BlogService } from '../../blog/services/blog.service';
import { CommentDbModel } from '../../comment/comment.data.models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogService: BlogService,
  ) {}

  async createNew(
    postData: PostInputModel,
  ): Promise<ServiceResult<PostViewModel>> {
    const blogId = postData.blogId;
    if (!blogId)
      return { status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    const blog = await this.blogService.findOneById(blogId);
    if (!blog.data)
      return { status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    const insertDataModel: PostDbInsertModel = {
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content || '',
      blogId: blog.data.id,
      blogName: blog.data.name,
      createdAt: new Date().toISOString(),
    };
    const newPost = await this.postsRepository.create(insertDataModel);
    const postViewModel = await getPostViewModel(newPost);
    return { data: postViewModel, status: true };
  }
  async find(
    sortBy: string,
    sortDir: number,
    page: number,
    size: number,
  ): Promise<ServiceResult<GetResult<PostViewModel>>> {
    const posts = await this.postsRepository.findMany(
      sortBy,
      sortDir,
      page,
      size,
    );
    if (!posts) {
      return { data: null, status: false };
    }
    const arrayOfPostViewModels = await getArrayOfPostsViewModels(posts.data);
    const paginatedResult = paginateResult(
      { totalCount: posts.totalCount, data: arrayOfPostViewModels },
      size,
      page,
    );

    return {
      data: paginatedResult,
      status: true,
    };
  }

  async findById(id: string): Promise<ServiceResult<PostViewModel>> {
    if (!id) {
      return { data: null, status: false };
    }
    const post = await this.postsRepository.findById(id);
    if (!post) {
      return { data: null, status: false };
    }

    const postViewModel = await getPostViewModel(post);

    return { data: postViewModel, status: true };
  }

  async findByBlogId(
    id: string,
    sortBy: string,
    sortDir: number,
    page: number,
    size: number,
    userId: string,
  ): Promise<ServiceResult<GetResult<PostViewModel>>> {
    if (!id) {
      return { data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    }
    const blog = await this.blogService.findOneById(id);
    if (!blog) {
      return { data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    }
    const post = await this.postsRepository.findByBlogId(
      id,
      sortBy,
      sortDir,
      page,
      size,
      userId,
    );
    const arrayOfPostsViewModels = await getArrayOfPostsViewModels(post.data);
    const paginatedResult = paginateResult(
      { totalCount: post.totalCount, data: arrayOfPostsViewModels },
      size,
      page,
    );
    return { data: paginatedResult, status: true };
  }

  async deleteById(id: string): Promise<ServiceResult<PostDbModel>> {
    if (!id) {
      return { data: null, status: false };
    }

    const isDeleted = await this.postsRepository.delete(id);
    if (!isDeleted) {
      return { data: null, status: false };
    }
    if (isDeleted.deletedCount === 0) {
      return { data: null, status: false };
    }

    return { data: null, status: true };
  }

  async updateById(
    id: string,
    fieldToUpdate: PostInputModel,
  ): Promise<ServiceResult<PostDbModel>> {
    if (!id) {
      return { data: null, status: false };
    }
    if (!ObjectId.isValid(fieldToUpdate.blogId)) {
      return { status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    }
    const blog = await this.blogService.findOneById(fieldToUpdate.blogId);
    if (!blog.data)
      return { status: false, data: null, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    const isUpdated = await this.postsRepository.update(id, fieldToUpdate);
    if (!isUpdated) {
      return { data: null, status: false };
    }

    if (isUpdated.matchedCount === 0) {
      return { data: null, status: false };
    }

    return { data: null, status: true };
  }

  async likePost(
    id: string,
    status: string,
    userId: string,
    userLogin: string,
  ): Promise<ServiceResult<CommentDbModel>> {
    if (!(id && status && userId && userLogin)) {
      return { data: null, status: false };
    }
    const post = await this.postsRepository.findOneSimple(id);
    if (!post) {
      return { data: null, status: false, msg: SERVICE_CUSTOM_MSG.NOT_FOUND };
    }
    const result = await this.postsRepository.likePost(
      id,
      status,
      userId,
      userLogin,
    );

    if (!result) {
      return { data: null, status: false };
    }

    if (result.matchedCount == 0 && result.upsertedCount == 0) {
      return { data: null, status: false };
    }

    return { data: null, status: true };
  }
}
