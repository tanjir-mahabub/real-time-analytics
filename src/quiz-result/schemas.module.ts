import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizResult, QuizResultSchema } from '../schema/quiz-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizResult.name, schema: QuizResultSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SchemasModule {}
