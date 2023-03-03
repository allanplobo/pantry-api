import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class PantryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const requiredFields = ['name', 'price', 'quantity'];
    const missingFields = requiredFields.filter(
      (field) => !(field in createProductDto),
    );
    if (missingFields.length > 0) {
      const missingFieldsMessage = `Product's missing required fields: ${missingFields.join(
        ', ',
      )}`;
      throw new Error(missingFieldsMessage);
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }
}
