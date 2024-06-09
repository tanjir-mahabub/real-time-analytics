import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Welcome to real time analytic application." with status code 200', () => {
      jest.spyOn(appService, 'getHello').mockReturnValue({
        message: 'Welcome to real time analytic application.',
      });

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      appController.getHello(mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(200);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Welcome to real time analytic application.',
        statusCode: 200,
      });
    });
  });
});
