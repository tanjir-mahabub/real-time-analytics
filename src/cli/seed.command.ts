import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { QuizResultsService } from 'src/quiz-result/quiz-results.service';

interface SeedCommandOptions {
  adminPassword?: string;
  user1Password?: string;
  user2Password?: string;
}

@Injectable()
@Command({
  name: 'seed',
  description: 'Seed the database',
  options: { isDefault: true },
})
export class SeedCommand extends CommandRunner {
  constructor(
    private readonly userService: UserService,
    private readonly quizResultsService: QuizResultsService,
  ) {
    super();
  }

  async run(
    passedParam: string[],
    options?: SeedCommandOptions,
  ): Promise<void> {
    await this.seed(options);
  }

  @Option({
    flags: '-ap, --admin-password [password]',
    description: 'Password for the admin user',
  })
  parseAdminPassword(val: string): string {
    return val;
  }

  @Option({
    flags: '-u1p, --user1-password [password]',
    description: 'Password for user1',
  })
  parseUser1Password(val: string): string {
    return val;
  }

  @Option({
    flags: '-u2p, --user2-password [password]',
    description: 'Password for user2',
  })
  parseUser2Password(val: string): string {
    return val;
  }

  async seed(options?: SeedCommandOptions) {
    console.log('Seeding database...');

    const adminPassword = options?.adminPassword || 'adminpassword';
    const user1Password = options?.user1Password || 'userpassword1';
    const user2Password = options?.user2Password || 'userpassword2';

    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);
    const hashedPasswordUser1 = await bcrypt.hash(user1Password, 10);
    const hashedPasswordUser2 = await bcrypt.hash(user2Password, 10);

    await this.userService.create({
      username: 'admin',
      password: hashedPasswordAdmin,
      role: 'admin',
    });
    await this.userService.create({
      username: 'user1',
      password: hashedPasswordUser1,
      role: 'user',
    });
    await this.userService.create({
      username: 'user2',
      password: hashedPasswordUser2,
      role: 'user',
    });

    await this.quizResultsService.create({
      userId: 'user1_id',
      score: 85,
      duration: 300,
      quizDate: new Date('2024-06-08T10:00:00Z'),
    });
    await this.quizResultsService.create({
      userId: 'user1_id',
      score: 90,
      duration: 320,
      quizDate: new Date('2024-06-07T14:30:00Z'),
    });
    await this.quizResultsService.create({
      userId: 'user2_id',
      score: 75,
      duration: 310,
      quizDate: new Date('2024-06-06T08:45:00Z'),
    });

    console.log('Database seeded successfully');
  }
}
