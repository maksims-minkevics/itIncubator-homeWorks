import {
  CommentDbModel,
  CommentModelWithLikeData,
  CommentViewModel,
} from '../comment.data.models';
import { CommentDocument } from '../schemas/comment.schema';

export const getCommentViewModel = (
  comment: CommentModelWithLikeData | CommentDbModel | null,
): CommentViewModel | null => {
  if (!comment) return null;

  const hasLikesInfo = (
    comment: CommentDbModel | CommentModelWithLikeData,
  ): comment is CommentModelWithLikeData => {
    return (
      'likesCount' in comment &&
      'dislikesCount' in comment &&
      'myStatus' in comment
    );
  };

  return {
    content: comment.content,
    id: comment._id.toString(),
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: hasLikesInfo(comment) ? comment.likesCount : 0,
      dislikesCount: hasLikesInfo(comment) ? comment.dislikesCount : 0,
      myStatus: hasLikesInfo(comment) ? comment.myStatus : 'None',
    },
  };
};

export const getArrayOfCommentViewModels = (
  comments: CommentModelWithLikeData[] | [],
): CommentViewModel[] | [] => {
  if (Array.isArray(comments)) {
    return comments.map((comment: CommentModelWithLikeData) => ({
      content: comment.content,
      id: comment._id.toString(),
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        dislikesCount: comment.dislikesCount,
        likesCount: comment.likesCount,
        myStatus: comment.myStatus,
      },
    }));
  }
  return [];
};
