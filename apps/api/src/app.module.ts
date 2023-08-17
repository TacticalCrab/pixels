import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanvasGateway } from './canvas/canvas.gateway';
import { CanvasModule } from './canvas/canvas.module';
import {ScheduleModule} from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
      CanvasModule,
      ScheduleModule.forRoot(),
      PrismaModule
  ],
})
export class AppModule {}
