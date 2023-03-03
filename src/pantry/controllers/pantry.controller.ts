import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
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

  @Post('products')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      return await this.pantryService.createProduct(createProductDto);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
