import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appDataSource from './infrastructure/persistence/data-source';

function shouldRunMigrationsOnStart(): boolean {
  if (process.env.RUN_MIGRATIONS_ON_START === 'false') return false;
  if (process.env.RUN_MIGRATIONS_ON_START === 'true') return true;
  return process.env.NODE_ENV === 'production';
}

/** Con `synchronize` apagado en producción, las tablas deben existir antes del seed en `onModuleInit`. */
async function runMigrationsIfNeeded(): Promise<void> {
  if (!shouldRunMigrationsOnStart()) return;

  await appDataSource.initialize();
  try {
    await appDataSource.runMigrations();
  } finally {
    await appDataSource.destroy();
  }
}

async function bootstrap() {
  await runMigrationsIfNeeded();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
