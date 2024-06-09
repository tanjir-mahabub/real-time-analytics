import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { QuizResultsService } from './quiz-results.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateQuizResultDto } from './dto/create-quiz-result.dto';
import { QuizResult } from 'src/schema/quiz-result.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('quiz-results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizResultsController {
  constructor(private readonly quizResultsService: QuizResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async create(@Body() createQuizResultDto: CreateQuizResultDto) {
    return this.quizResultsService.create(createQuizResultDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<QuizResult[]> {
    return this.quizResultsService.findAll();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findByUserId(@Param('userId') userId: string): Promise<QuizResult[]> {
    return this.quizResultsService.findByUserId(userId);
  }

  @Get()
  @Roles(Role.User, Role.Admin)
  async findByTimeInterval(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.quizResultsService.findByTimeInterval(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('aggregates')
  @Roles(Role.Admin)
  async calculateAggregates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.quizResultsService.calculateAggregates(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
