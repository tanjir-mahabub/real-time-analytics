import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { findByUsername: jest.fn(), create: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user', async () => {
    const createUserDto = { username: 'test', password: 'test', role: 'user' };
    userService.findByUsername = jest.fn().mockResolvedValue(null);
    userService.create = jest.fn().mockResolvedValue(createUserDto);
    jwtService.sign = jest.fn().mockReturnValue('token');

    const result = await authService.register(createUserDto);
    expect(result).toEqual({ username: 'test', token: 'token' });
  });

  it('should throw conflict exception if user already exists', async () => {
    const createUserDto = { username: 'test', password: 'test', role: 'user' };
    userService.findByUsername = jest.fn().mockResolvedValue(createUserDto);

    await expect(authService.register(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should login a user', async () => {
    const loginUserDto = { username: 'test', password: 'test' };
    const user = { username: 'test', password: 'hashedPassword', role: 'user' };
    userService.findByUsername = jest.fn().mockResolvedValue(user);
    jwtService.sign = jest.fn().mockReturnValue('token');

    const result = await authService.login(loginUserDto);
    expect(result).toEqual({ username: 'test', token: 'token' });
  });

  it('should throw unauthorized exception for invalid credentials', async () => {
    const loginUserDto = { username: 'test', password: 'wrongPassword' };
    userService.findByUsername = jest.fn().mockResolvedValue(null);

    await expect(authService.login(loginUserDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
