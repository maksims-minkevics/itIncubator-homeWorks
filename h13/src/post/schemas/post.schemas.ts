import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import HydratedDocument from 'mongoose';

@Schema()
export class Posts {
  @Prop({ type: String, default: '', required: true })
  title: string;
  @Prop({ type: String, default: '', required: true })
  shortDescription: string;
  @Prop({ type: String, default: '', required: true })
  content: string;
  @Prop({ type: String, default: '', required: true })
  blogId: string;
  @Prop({ type: String, default: '', required: true })
  blogName: string;
  @Prop({
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  })
  createdAt: string;
  @Prop({ _id: true, versionKey: false })
  _id: ObjectId;
}
export const PostsSchema = SchemaFactory.createForClass(Posts);

export type PostDocument = HydratedDocument<Posts>;
