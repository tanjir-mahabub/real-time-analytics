import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizResultsService } from './quiz-results.service';
import { QuizResultsController } from './quiz-results.controller';
import { QuizResultsGateway } from './quiz-results.gateway';
import { QuizResult, QuizResultSchema } from '../schema/quiz-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizResult.name, schema: QuizResultSchema },
    ]),
  ],
  controllers: [QuizResultsController],
  providers: [QuizResultsService, QuizResultsGateway],
  exports: [QuizResultsService],
})
export class QuizResultsModule {}
