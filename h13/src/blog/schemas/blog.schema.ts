import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Blogs {
  @Prop({ type: String, default: '', required: true })
  name: string;
  @Prop({ type: String, default: '', required: true })
  description: string;
  @Prop({ type: String, default: '', required: true })
  websiteUrl: string;
  @Prop({ type: Boolean, default: false, required: true })
  isMembership: boolean;
  @Prop({
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  })
  createdAt: string;
  @Prop({ _id: true, versionKey: false })
  _id: ObjectId;
}

export type BlogDocument = HydratedDocument<Blogs>;
export const BlogSchema = SchemaFactory.createForClass(Blogs);
