import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder.service';
import { SeederModule } from './seeder.module';
import { AppModule } from '../app.module';

@Module({
  imports: [AppModule, SeederModule],
})
class SeedAppModule {}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedAppModule);
  const seeder = appContext.get(SeederService);
  await seeder.seederAllData();
  await appContext.close();
}
void bootstrap();
