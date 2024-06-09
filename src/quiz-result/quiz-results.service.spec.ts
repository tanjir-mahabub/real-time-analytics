import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { QuizResult } from 'src/schema/quiz-result.schema';
import { QuizResultsGateway } from './quiz-results.gateway';

const mockQuizResult = {
  userId: '1',
  quizDate: new Date(),
  duration: 10,
  score: 100,
};

describe('QuizResultsService', () => {
  let service: QuizResultsService;

  const mockQuizResultModel = {
    new: jest.fn().mockResolvedValue(mockQuizResult),
    constructor: jest.fn().mockResolvedValue(mockQuizResult),
    create: jest.fn().mockResolvedValue(mockQuizResult),
    save: jest.fn().mockResolvedValue(mockQuizResult),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockQuizResult]),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockQuizResult),
    }),
    aggregate: jest.fn().mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValue([{ averageScore: 80, totalScore: 240 }]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizResultsService,
        QuizResultsGateway,
        {
          provide: getModelToken(QuizResult.name),
          useValue: mockQuizResultModel,
        },
      ],
    }).compile();

    service = module.get<QuizResultsService>(QuizResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a quiz result', async () => {
      const result = await service.create(mockQuizResult as any);
      expect(result).toEqual(mockQuizResult);
    });
  });

  describe('findAll', () => {
    it('should return all quiz results', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockQuizResult]);
    });
  });

  describe('findByUserId', () => {
    it('should return quiz results for a specific user', async () => {
      const result = await service.findByUserId('1');
      expect(result).toEqual([mockQuizResult]);
    });

    it('should handle errors when user is unauthorized', async () => {
      mockQuizResultModel.find.mockReturnValueOnce({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new UnauthorizedException('Unauthorized')),
      } as any);

      await expect(service.findByUserId('1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findByTimeInterval', () => {
    it('should return quiz results within a specific time interval', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');

      const result = await service.findByTimeInterval(startDate, endDate);
      expect(result).toEqual([mockQuizResult]);
    });
  });

  describe('calculateAggregates', () => {
    it('should return aggregated quiz results', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');

      const result = await service.calculateAggregates(startDate, endDate);
      expect(result).toEqual({ averageScore: 80, totalScore: 240 });
    });
  });
});
