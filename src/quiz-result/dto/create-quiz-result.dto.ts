import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizResultDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  quizDate: Date;
}
