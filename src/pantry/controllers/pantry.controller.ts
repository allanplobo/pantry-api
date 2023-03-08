import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
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

  @Get('products/:id')
  async getProductById(@Param('id') productId: string): Promise<Product> {
    try {
      return await this.pantryService.getProductById(productId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  @Get('products/search/:name')
  async searchProducts(@Param('name') name: string): Promise<Product[]> {
    try {
      return await this.pantryService.searchProductsByName(name);
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

  @Put('products/:id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.pantryService.updateProduct(
        productId,
        updateProductDto,
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  @Delete('products/:id')
  async deleteProduct(
    @Param('id') productId: string,
  ): Promise<{ message: string }> {
    try {
      return await this.pantryService.deleteProduct(productId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }
}
