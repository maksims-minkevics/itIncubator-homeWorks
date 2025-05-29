import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import HydratedDocument from 'mongoose';

export class PostsLikes {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: ObjectId, ref: 'Posts', required: true })
  postId: ObjectId;
  @Prop({ type: String, default: 'None' })
  status: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  addedAt: string;
  @Prop({ _id: true, versionKey: false })
  _id: ObjectId;
}
export const PostsLikeSchema = SchemaFactory.createForClass(PostsLikes);
export type PostsLikeDocument = HydratedDocument<PostsLikes>;
