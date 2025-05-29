import { ObjectId } from 'mongodb';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import HydratedDocument from 'mongoose';

@Schema()
export class Comments {
  @Prop({ type: String, required: true })
  content: string;
  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  @Prop({ type: String, default: () => new Date().toISOString() })
  createdAt: string;
  @Prop({
    type: ObjectId,
    ref: 'Posts',
    required: true,
  })
  postId: ObjectId;
  @Prop({ _id: true, versionKey: false })
  _id: ObjectId;
}
export const CommentSchema = SchemaFactory.createForClass(Comments);

export type CommentDocument = HydratedDocument<Comments>;
