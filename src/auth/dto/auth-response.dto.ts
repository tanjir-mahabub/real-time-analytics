import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'JWT token' })
  token: string;
}
