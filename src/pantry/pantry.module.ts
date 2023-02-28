import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PantryController } from './controllers/pantry.controller';
import { Product } from './entities/product.entity';
import { PantryService } from './services/pantry.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'pantry',
      entities: [Product],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [PantryController],
  providers: [PantryService],
})
export class PantryModule {}
