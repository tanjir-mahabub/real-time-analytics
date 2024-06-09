import { Module } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { SeedCommand } from './seed.command';
import { UsersModule } from 'src/users/users.module';
import { QuizResultsModule } from 'src/quiz-result/quiz-results.module';

@Module({
  imports: [UsersModule, QuizResultsModule],
  providers: [SeedCommand],
})
export class CliModule {
  static async run() {
    await CommandFactory.run(CliModule);
  }
}
