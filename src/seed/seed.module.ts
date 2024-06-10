import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { SeedService } from './seed.service';
import { UserService } from 'src/users/users.service';
import { QuizResult, QuizResultSchema } from 'src/schema/quiz-result.schema';
import { QuizResultsModule } from 'src/quiz-result/quiz-results.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI_DEV + process.env.MONGO_DB_NAME,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: QuizResult.name, schema: QuizResultSchema },
    ]),
    QuizResultsModule,
  ],
  providers: [SeedService, UserService],
})
export class SeedModule {}
