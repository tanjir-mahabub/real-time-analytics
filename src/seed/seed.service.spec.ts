import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { UserService } from '../users/users.service';
import { QuizResultsService } from '../quiz-result/quiz-results.service';
import * as bcrypt from 'bcrypt';

describe('SeedService', () => {
  let seedService: SeedService;
  let userService: UserService;
  let quizResultsService: QuizResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: QuizResultsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    userService = module.get<UserService>(UserService);
    quizResultsService = module.get<QuizResultsService>(QuizResultsService);
  });

  it('should seed the database with users and quiz results', async () => {
    // Mock hashed passwords
    const hashedPasswordAdmin = await bcrypt.hash('adminpassword', 10);
    const hashedPasswordUser1 = await bcrypt.hash('userpassword1', 10);
    const hashedPasswordUser2 = await bcrypt.hash('userpassword2', 10);

    // Mock users data
    const users = [
      { username: 'admin', password: hashedPasswordAdmin, role: 'admin' },
      { username: 'user1', password: hashedPasswordUser1, role: 'user' },
      { username: 'user2', password: hashedPasswordUser2, role: 'user' },
      { username: 'user3', password: hashedPasswordUser2, role: 'user' },
    ];

    // Mock quiz results data
    const quizResults = [
      {
        userId: 'user1_id',
        score: 85,
        duration: 300,
        quizDate: new Date('2024-06-08T10:00:00Z'),
      },
      {
        userId: 'user2_id',
        score: 90,
        duration: 320,
        quizDate: new Date('2024-06-07T14:30:00Z'),
      },
      {
        userId: 'user3_id',
        score: 75,
        duration: 310,
        quizDate: new Date('2024-06-06T08:45:00Z'),
      },
    ];

    // Mock the userService.create method to return created users
    (userService.create as jest.Mock).mockImplementation((user) =>
      Promise.resolve(user),
    );

    // Mock the quizResultsService.create method to return created quiz results
    (quizResultsService.create as jest.Mock).mockImplementation((quizResult) =>
      Promise.resolve(quizResult),
    );

    // Call the seed method
    await seedService.seed();

    // Verify that userService.create method is called with the correct user data
    expect(userService.create).toHaveBeenCalledWith(users[0]);
    expect(userService.create).toHaveBeenCalledWith(users[1]);
    expect(userService.create).toHaveBeenCalledWith(users[2]);
    expect(userService.create).toHaveBeenCalledWith(users[3]);

    // Verify that quizResultsService.create method is called with the correct quiz result data
    expect(quizResultsService.create).toHaveBeenCalledWith(quizResults[0]);
    expect(quizResultsService.create).toHaveBeenCalledWith(quizResults[1]);
    expect(quizResultsService.create).toHaveBeenCalledWith(quizResults[2]);
  });
});
