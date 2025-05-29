import { ObjectId } from 'mongodb';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import HydratedDocument from 'mongoose';

@Schema()
export class CommentLikes {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({
    type: ObjectId,
    ref: 'Comments',
    required: true,
  })
  commentId: ObjectId;

  @Prop({ type: String, default: 'None' })
  status: string;

  @Prop({ _id: true, versionKey: false })
  _id: ObjectId;
}
export const CommentLikeSchema = SchemaFactory.createForClass(CommentLikes);

export type CommentLikeDocument = HydratedDocument<CommentLikes>;
