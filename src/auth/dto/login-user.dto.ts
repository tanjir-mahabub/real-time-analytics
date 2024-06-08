import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'username', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  password: string;
}
