import {BlogViewModel, BlogError} from "../object-types";
import {blogsDb} from "../dbs/blogs-db";
import {postsDb} from "../dbs/posts-db";
class blogDbHandlerClass {

    findBlog(id: string): BlogViewModel;
    findBlog(): BlogViewModel[];
    findBlog(id?: string): BlogViewModel | BlogViewModel[] | undefined {

        if (id) {
            return blogsDb.dbRows.filter(blog => blog.id === id)[0];
        } else {
            return blogsDb.dbRows
        }

    };

    createBlog(blog: BlogViewModel): BlogViewModel | BlogError[] {

        const newblog : BlogViewModel = {
            id: (1+blogsDb.dbRows.length).toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
        }
        blogsDb.dbRows.push(newblog);
        return newblog;
    };

    updateBlog(id: string, fieldsToUpdate: BlogViewModel): BlogViewModel | undefined | BlogError[]{
        if (!id) {
            return undefined;
        }

        const blogToUpdate = this.findBlog(id);
        if (!blogToUpdate) {
            return undefined;
        }

        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate[key as keyof BlogViewModel] !== undefined) {
                (blogToUpdate[key as keyof BlogViewModel] as any) = fieldsToUpdate[key as keyof BlogViewModel];
            }
        }

        return blogToUpdate;
    }

    deleteblog(id: string): string | undefined {
        if (!id) {
            return undefined;
        }

        const blogToDelete = this.findBlog(id);
        if (!blogToDelete) {
            return undefined;
        }
        blogsDb.dbRows.splice(this.getBlogEntryIndex(blogToDelete), 1);
        return id;
    }

    getBlogEntryIndex(blog: BlogViewModel){
        return blogsDb.dbRows.findIndex(obj => obj.id === blog.id);
    }

    dropDb(){
        blogsDb.dbRows = [];
    }

}
export {blogDbHandlerClass}
