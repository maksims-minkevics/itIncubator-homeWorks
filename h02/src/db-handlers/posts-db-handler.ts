import {PostViewModel, PostInputModel} from "../object-types";
import {postsDb} from "../dbs/posts-db";
class postDbHandlerClass {

    findPost(id: string): PostViewModel;
    findPost(): PostViewModel[];
    findPost(id?: string): PostViewModel | PostViewModel[] | undefined {

        if (id) {
            return postsDb.dbRows.filter(post => post.id === id)[0];
        } else {
            return postsDb.dbRows
        }

    };

    createPost(post: PostInputModel): PostViewModel{
        const newPost : PostViewModel = {
            id: postsDb.dbRows.length.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content || "",
            blogId: post.blogId,
            blogName: ""// TO DO
        }

        return newPost;
    };

    updatePost(id: string, fieldsToUpdate: PostInputModel): PostInputModel | undefined{
        if (!id) {
            return undefined;
        }

        const postToUpdate = this.findPost(id);
        if (!postToUpdate) {
            return undefined;
        }

        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate[key as keyof PostInputModel] !== undefined) {
                (postToUpdate[key as keyof PostInputModel] as any) = fieldsToUpdate[key as keyof PostInputModel];
            }
        }

        return fieldsToUpdate;
    }

    deletePost(id: string): string | undefined {
        if (!id) {
            return undefined;
        }

        const postToDelete = this.findPost(id);
        if (!postToDelete) {
            return undefined;
        }
        postsDb.dbRows.splice(this.getPostEntryIndex(postToDelete), 1);
        return id;
    }
    getPostEntryIndex(post : PostViewModel){
        return postsDb.dbRows.findIndex(obj => obj.id === post.id);
    }
    dropDb(){
        postsDb.dbRows = [];
    }
}
export {postDbHandlerClass}
