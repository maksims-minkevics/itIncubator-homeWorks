import {
    BlogDbModel,
    BlogDbQueryResultForPagination,
    BlogInputModel
} from './blog.data.models';
import { ObjectId } from 'mongodb';
import { Model, SortOrder } from 'mongoose';
import { getFormattedDate } from '../general/general.utilities';
import { getBlogDbModel } from './services/blog.mapper';
import { Blogs, BlogDocument } from './schemas/blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogRepository {
    constructor(@InjectModel(Blogs.name) private blogModel: Model<BlogDocument>) {}

    async findBlogById(id: string): Promise<BlogDbModel | null> {
        try {
            const blog = await this.blogModel
              .findOne({ _id: new ObjectId(id) })
              .lean()
              .exec();
            return blog as BlogDbModel;
        } catch (error) {
            console.error('❌ Error in findBlogById:', error);
            return null;
        }
    }

    async findMany(
      searchParam: string,
      sortBy: string,
      sortDir: number,
      page: number,
      size: number
    ): Promise<BlogDbQueryResultForPagination> {
        try {
            const query = searchParam
              ? { name: { $regex: searchParam, $options: 'i' } }
              : {};

            const data = (await this.blogModel
              .find(query)
              .sort({ [sortBy]: sortDir as SortOrder })
              .skip((page - 1) * size)
              .limit(size)
              .lean()
              .exec()) as BlogDbModel[];

            const totalCount = await this.blogModel.countDocuments(query).exec();
            return { data, totalCount };
        } catch (error) {
            console.error('❌ Error in findMany:', error);
            return { data: [], totalCount: 0 };
        }
    }

    async delete(id: string) {
        try {
            return await this.blogModel.deleteOne({ _id: new ObjectId(id) }).exec();
        } catch (error) {
            console.error('❌ Error in delete:', error);
            return null;
        }
    }

    async update(id: string, blogData: BlogInputModel) {
        try {
            return await this.blogModel
              .updateOne({ _id: new ObjectId(id) }, { $set: blogData })
              .exec();
        } catch (error) {
            console.error('❌ Error in update:', error);
            return null;
        }
    }

    async create(blog: BlogInputModel): Promise<BlogDbModel | null> {
        try {
            const newEntry = new this.blogModel({
                ...blog,
                isMembership: false,
                createdAt: await getFormattedDate(),
            });

            await newEntry.save();
            return getBlogDbModel(newEntry);
        } catch (error) {
            console.error('❌ Error in create:', error);
            return null;
        }
    }

    async dropDb() {
        try {
            await this.blogModel.collection.drop();
        } catch (error) {
            console.error('❌ Error in dropDb:', error);
        }
    }
}
