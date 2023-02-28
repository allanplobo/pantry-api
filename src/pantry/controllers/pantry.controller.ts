import { Controller, Get, Logger } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { PantryService } from '../services/pantry.service';

@Controller('pantry')
export class PantryController {
  private readonly logger = new Logger(PantryController.name);

  constructor(private readonly pantryService: PantryService) {}

  @Get('products')
  async getProducts(): Promise<Product[]> {
    try {
      return await this.pantryService.getProducts();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
