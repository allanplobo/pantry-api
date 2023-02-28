import { Module } from '@nestjs/common';
import { PantryController } from './controllers/pantry.controller';
import { PantryService } from './services/pantry.service';

@Module({
  controllers: [PantryController],
  providers: [PantryService],
})
export class PantryModule {}
