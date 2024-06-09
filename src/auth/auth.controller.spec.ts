import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return the auth response', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
        role: 'user',
      };

      const result: AuthResponseDto = {
        username: 'testuser',
        token: 'testtoken',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await controller.register(createUserDto)).toEqual(result);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle errors during registration', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpass',
        role: 'user',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error('Registration error'));

      await expect(controller.register(createUserDto)).rejects.toThrow(
        'Registration error',
      );
    });
  });

  describe('login', () => {
    it('should login a user and return the auth response', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'testpass',
      };

      const result: AuthResponseDto = {
        username: 'testuser',
        token: 'testtoken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await controller.login(loginUserDto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should handle errors during login', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'testpass',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
