import { ObjectId } from 'mongodb';
import {
  CommentsDbQueryResultForPagination,
  CommentModelWithLikeData,
} from './comment.data.models';
import { getDbSortDir } from '../general/general.utilities';
import { InjectModel } from '@nestjs/mongoose';
import { PostsLikes } from '../post/schemas/postlike.schema';
import { Model } from 'mongoose';
import { CommentDocument } from './schemas/comment.schema';
import { CommentLikeDocument } from './schemas/commentlike.schema';

export class CommentsRepository {
  constructor(
    @InjectModel(PostsLikes.name)
    private commentModel: Model<CommentDocument>,
    protected commentsLikesModel: Model<CommentLikeDocument>,
  ) {}
  async findOne(id: string): Promise<CommentModelWithLikeData | null> {
    try {
      const result = await this.commentModel
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },

          {
            $lookup: {
              from: 'commentslikes',
              localField: '_id',
              foreignField: 'commentId',
              as: 'likesData',
            },
          },
          {
            $addFields: {
              likesCount: {
                $size: {
                  $filter: {
                    input: '$likesData',
                    as: 'like',
                    cond: { $eq: ['$$like.status', 'Like'] },
                  },
                },
              },
              dislikesCount: {
                $size: {
                  $filter: {
                    input: '$likesData',
                    as: 'like',
                    cond: { $eq: ['$$like.status', 'Dislike'] },
                  },
                },
              },
              myStatus: 'None',
            },
          },
          {
            $project: {
              _id: 1,
              content: 1,
              likesCount: 1,
              dislikesCount: 1,
              myStatus: 1,
              createdAt: 1,
              commentatorInfo: 1,
            },
          },
        ])
        .exec();
      return result[0];
    } catch (error) {
      console.error('❌ Error in findOne:', error);
      return null;
    }
  }

  async findManyByPostId(
    id: string,
    sortBy: string,
    sortDir: number,
    page: number,
    size: number,
  ): Promise<CommentsDbQueryResultForPagination> {
    try {
      const sortDirSafe = await getDbSortDir(sortDir);
      const data = await this.commentModel
        .aggregate([
          {
            $match: {
              postId: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: 'commentslikes',
              localField: '_id',
              foreignField: 'commentId',
              as: 'likesData',
            },
          },
          {
            $addFields: {
              likesCount: {
                $size: {
                  $filter: {
                    input: '$likesData',
                    as: 'like',
                    cond: { $eq: ['$$like.status', 'Like'] },
                  },
                },
              },
              dislikesCount: {
                $size: {
                  $filter: {
                    input: '$likesData',
                    as: 'like',
                    cond: { $eq: ['$$like.status', 'Dislike'] },
                  },
                },
              },
              myStatus: 'None',
            },
          },
          {
            $project: {
              _id: 1,
              content: 1,
              likesCount: 1,
              dislikesCount: 1,
              myStatus: 1,
              createdAt: 1,
              commentatorInfo: 1,
            },
          },
          {
            $sort: { [sortBy]: sortDirSafe },
          },
          {
            $skip: (page - 1) * size,
          },
          {
            $limit: size,
          },
        ])
        .exec();
      const totalCount = await this.commentModel
        .countDocuments({
          postId: new ObjectId(id),
        })
        .exec();
      return { data: data, totalCount: totalCount };
    } catch (error) {
      console.error('❌ Error in findManyByPostId:', error);
      return { data: [], totalCount: 0 };
    }
  }

  async dropDb() {
    try {
      await this.commentModel.collection.drop();
      await this.commentsLikesModel.collection.drop();
    } catch (error) {
      console.error('❌ Error in findBlogById:', error);
    }
  }
}
