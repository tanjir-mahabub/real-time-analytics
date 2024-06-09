import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MethodValidatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedMethods = ['GET'];
    if (!allowedMethods.includes(req.method)) {
      throw new HttpException(
        `Method ${req.method} not allowed for this route`,
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    next();
  }
}
