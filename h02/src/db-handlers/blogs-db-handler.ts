import {blogDataValidatorClass} from "../validations/blog-validation";
import {BlogViewModel, BlogError} from "../object-types";
class blogDbHandlerClass {

    findBlog(id: string): BlogViewModel;
    findBlog(): BlogViewModel[];
    findBlog(id?: string): BlogViewModel | BlogViewModel[] | undefined {

        if (id) {
            return blogs.filter(blog => blog.id === id)[0];
        } else {
            return blogs
        }

    };

    createBlog(blog: BlogViewModel): BlogViewModel | BlogError[] {
        const validationErrors = new blogDataValidatorClass(blog);
        validationErrors.validate();
        if (validationErrors.failedValidations.length != 0) {
            return validationErrors.failedValidations;
        }
        const newblog : BlogViewModel = {
            id: blogs.length.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl || "",
        }
        blogs.push(newblog);
        return newblog;
    };

    updateBlog(id: string, fieldsToUpdate: BlogViewModel): BlogViewModel | undefined | BlogError[]{
        if (!id) {
            return undefined;
        }

        const validationErrors = new blogDataValidatorClass(fieldsToUpdate);
        validationErrors.validate();

        if (validationErrors.failedValidations.length) {
            return validationErrors.failedValidations;
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
        blogs.splice(this.getBlogEntryIndex(blogToDelete), 1);
        return id;
    }

    getBlogEntryIndex(blog: BlogViewModel){
        return blogs.findIndex(obj => obj.id === blog.id);
    }
    dropDb(){
        return blogs = [];
    }
}
export {blogDbHandlerClass}
