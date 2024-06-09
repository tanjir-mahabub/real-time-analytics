import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { QuizResultsController } from './quiz-results.controller';
import { QuizResultsService } from './quiz-results.service';
import { QuizResult } from 'src/schema/quiz-result.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

describe('QuizResultsController', () => {
  let controller: QuizResultsController;
  let service: QuizResultsService;

  const mockQuizResultsService = {
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    findByTimeInterval: jest.fn(),
    calculateAggregates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizResultsController],
      providers: [
        {
          provide: QuizResultsService,
          useValue: mockQuizResultsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<QuizResultsController>(QuizResultsController);
    service = module.get<QuizResultsService>(QuizResultsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of quiz results', async () => {
      const result: QuizResult[] = [
        { userId: '1', quizDate: new Date(), duration: 10, score: 100 },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findByUserId', () => {
    it('should return quiz results for a specific user', async () => {
      const result: QuizResult[] = [
        { userId: '1', quizDate: new Date(), duration: 10, score: 100 },
      ];
      jest.spyOn(service, 'findByUserId').mockResolvedValue(result);

      expect(await controller.findByUserId('1')).toBe(result);
    });

    it('should handle errors when user is unauthorized', async () => {
      jest
        .spyOn(service, 'findByUserId')
        .mockRejectedValue(new UnauthorizedException('Unauthorized'));

      await expect(controller.findByUserId('1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findByTimeInterval', () => {
    it('should return quiz results within a specific time interval', async () => {
      const result: QuizResult[] = [
        { userId: '1', quizDate: new Date(), duration: 10, score: 100 },
      ];
      const startDate = '2024-01-01';
      const endDate = '2024-01-02';

      jest.spyOn(service, 'findByTimeInterval').mockResolvedValue(result);

      expect(await controller.findByTimeInterval(startDate, endDate)).toBe(
        result,
      );
    });
  });

  describe('calculateAggregates', () => {
    it('should return aggregated quiz results', async () => {
      const result = { averageScore: 80, totalScore: 240 };
      const startDate = '2024-01-01';
      const endDate = '2024-01-02';

      jest.spyOn(service, 'calculateAggregates').mockResolvedValue(result);

      expect(await controller.calculateAggregates(startDate, endDate)).toBe(
        result,
      );
    });
  });
});
