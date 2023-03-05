import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PantryModule } from './pantry/pantry.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/pantry'),
        PantryModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should import MongooseModule', () => {
    expect(app.get(MongooseModule)).toBeDefined();
  });

  it('should import PantryModule', () => {
    expect(app.get(PantryModule)).toBeDefined();
  });

  it('should import AppController', () => {
    expect(app.get(AppController)).toBeDefined();
  });

  it('should import AppService', () => {
    expect(app.get(AppService)).toBeDefined();
  });
});
