import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    console.log('Registering user:', createUserDto);
    const { username, password, role } = createUserDto;
    const existingUser = await this.userService.findByUsername(username);

    if (existingUser) {
      console.error('Username already exists:', username);
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      username,
      password: hashedPassword,
      role: role || 'user',
    });

    const token = this.jwtService.sign({
      username: user.username,
      role: user.role,
    });
    console.log('User registered successfully:', {
      username: user.username,
      token,
    });
    return { username: user.username, token };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    console.log('Logging in user:', loginUserDto);
    const { username, password } = loginUserDto;
    const user = await this.userService.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error('Invalid credentials for user:', username);
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      username: user.username,
      role: user.role,
    });
    console.log('User logged in successfully:', {
      username: user.username,
      token,
    });
    return { username: user.username, token };
  }
}
