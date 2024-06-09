import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizResultsGateway } from './quiz-results.gateway';
import { QuizResult, QuizResultDocument } from '../schema/quiz-result.schema';

@Injectable()
export class QuizResultsService {
  constructor(
    @InjectModel(QuizResult.name)
    private quizResultModel: Model<QuizResultDocument>,
    private quizResultsGateway: QuizResultsGateway,
  ) {}

  async create(quizResult: QuizResult): Promise<QuizResult> {
    const createdResult = new this.quizResultModel(quizResult);
    await createdResult.save();
    this.quizResultsGateway.handleQuizResultCreated(createdResult);
    return createdResult;
  }

  async findAll(): Promise<QuizResult[]> {
    return this.quizResultModel.find().exec();
  }

  async findByUserId(userId: string): Promise<QuizResult[]> {
    return this.quizResultModel.find({ userId }).exec();
  }

  async findByTimeInterval(
    startDate: Date,
    endDate: Date,
  ): Promise<QuizResult[]> {
    return this.quizResultModel
      .find({
        quizDate: { $gte: startDate, $lte: endDate },
      })
      .exec();
  }

  async calculateAggregates(startDate: Date, endDate: Date) {
    const results = await this.quizResultModel.aggregate([
      { $match: { quizDate: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          totalScore: { $sum: '$score' },
        },
      },
    ]);

    return results[0];
  }
}
