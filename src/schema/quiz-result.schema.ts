import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizResultDocument = QuizResult & Document;

@Schema({ timestamps: true })
export class QuizResult {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  duration: number; // duration in seconds

  @Prop({ required: true })
  quizDate: Date;
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult);
