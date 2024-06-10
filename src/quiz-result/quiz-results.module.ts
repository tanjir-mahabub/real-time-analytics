import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizResultsService } from './quiz-results.service';
import { QuizResultsController } from './quiz-results.controller';
import { QuizResultsGateway } from './quiz-results.gateway';
import { QuizResult, QuizResultSchema } from '../schema/quiz-result.schema';
import { MethodValidatorMiddleware } from 'src/middleware/method-validator.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizResult.name, schema: QuizResultSchema },
    ]),
  ],
  controllers: [QuizResultsController],
  providers: [QuizResultsService, QuizResultsGateway],
  exports: [QuizResultsService, QuizResultsGateway],
})
export class QuizResultsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MethodValidatorMiddleware).forRoutes(QuizResultsController);
  }
}
