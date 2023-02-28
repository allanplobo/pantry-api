import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PantryModule } from './pantry/pantry.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pantry'),
    PantryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
