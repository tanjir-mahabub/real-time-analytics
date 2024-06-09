import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './src/seed/seed.module';
import { SeedService } from './src/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.close();
}

bootstrap().catch((err: any) => {
  console.error('Error running seed script', err);
  process.exit(1);
});
