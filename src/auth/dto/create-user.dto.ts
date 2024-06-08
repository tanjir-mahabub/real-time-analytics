import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    default: 'user',
    enum: ['user', 'admin'],
  })
  role: string;
}
