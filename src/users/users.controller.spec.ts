import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/roles.enum';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const mockUserService = {
      getProfile: jest.fn().mockImplementation((req) => req.user),
      getAdminData: jest.fn().mockReturnValue({ message: 'Admin data' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should return the user profile', () => {
    const req = { user: { username: 'testuser', role: Role.User } };
    expect(userController.getProfile(req)).toEqual(req.user);
  });

  it('should return admin data', () => {
    const req = { user: { username: 'admin', role: Role.Admin } };
    expect(userController.getAdminData(req)).toEqual({ message: 'Admin data' });
  });
});
