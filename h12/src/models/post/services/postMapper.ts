import {PostDbModel, PostModelWithLikeData, PostViewModel} from "../dataModels";
import {CommentDbModel, CommentModelWithLikeData} from "../../comment/dataModels";

export const getPostViewModel = async (post: PostModelWithLikeData | PostDbModel | null): Promise<PostViewModel | null> => {
    if (!post) return null;

    const hasLikesInfo = (
        post: PostDbModel | PostModelWithLikeData
    ): post is PostModelWithLikeData => {
        return (
            'likesCount' in post &&
            'dislikesCount' in post &&
            'myStatus' in post &&
            'newestLikes' in post
        );
    };

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            dislikesCount: hasLikesInfo(post) ? post.dislikesCount : 0,
            likesCount: hasLikesInfo(post) ? post.likesCount : 0,
            myStatus: hasLikesInfo(post) ? post.myStatus : "None",
            newestLikes: hasLikesInfo(post) ? post.newestLikes : [],
        }
    }
}

    export const getArrayOfPostsViewModels = async (posts: PostModelWithLikeData[] | []): Promise<PostViewModel[] | []> => {
    if (Array.isArray(posts)){
        return posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                dislikesCount: post.dislikesCount,
                likesCount: post.likesCount,
                myStatus: post.myStatus,
                newestLikes: post.newestLikes,
            }
        }));
    }
    return []
}