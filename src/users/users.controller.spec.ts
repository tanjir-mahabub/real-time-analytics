import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getProfile: jest
              .fn()
              .mockReturnValue({ username: 'testUser', role: 'user' }),
            getAdminData: jest.fn().mockReturnValue({ message: 'Admin data' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should return user profile', () => {
    const req = { user: { username: 'testUser', role: 'user' } };
    expect(userController.getProfile(req)).toEqual(req.user);
  });

  it('should return admin data', () => {
    const req = { user: { username: 'adminUser', role: 'admin' } };
    expect(userController.getAdminData(req)).toEqual({ message: 'Admin data' });
  });
});
