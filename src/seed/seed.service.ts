import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserService } from 'src/users/users.service';
import { CreateQuizResultDto } from 'src/quiz-result/dto/create-quiz-result.dto';
import { QuizResultsService } from 'src/quiz-result/quiz-results.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly quizResultsService: QuizResultsService,
  ) {}

  async seed() {
    const hashedPasswordAdmin = await bcrypt.hash('adminpassword', 10);
    const hashedPasswordUser1 = await bcrypt.hash('userpassword1', 10);
    const hashedPasswordUser2 = await bcrypt.hash('userpassword2', 10);

    const users: CreateUserDto[] = [
      { username: 'admin', password: hashedPasswordAdmin, role: 'admin' },
      { username: 'user1', password: hashedPasswordUser1, role: 'user' },
      { username: 'user2', password: hashedPasswordUser2, role: 'user' },
      { username: 'user3', password: hashedPasswordUser2, role: 'user' },
    ];

    const createdUsers = [];
    for (const user of users) {
      const createdUser = await this.userService.create(user);
      createdUsers.push(createdUser);
      console.log(
        `Created user: ${createdUser.username} with ID: ${createdUser}`,
      );
    }

    const quizResults: CreateQuizResultDto[] = [
      {
        userId: createdUsers.find((user) => user.username === 'user1')._id,
        score: 85,
        duration: 300,
        quizDate: new Date('2024-06-08T10:00:00Z'),
      },
      {
        userId: createdUsers.find((user) => user.username === 'user2')._id,
        score: 90,
        duration: 320,
        quizDate: new Date('2024-06-07T14:30:00Z'),
      },
      {
        userId: createdUsers.find((user) => user.username === 'user3')._id,
        score: 75,
        duration: 310,
        quizDate: new Date('2024-06-06T08:45:00Z'),
      },
    ];

    for (const quizResult of quizResults) {
      const createdQuizResult =
        await this.quizResultsService.create(quizResult);
      console.log(
        `Created quiz result for user ID: ${quizResult.userId} with score: ${quizResult.score} created results: ${createdQuizResult}`,
      );
    }

    console.log('Database seeded!');
  }
}
