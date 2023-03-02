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
    const requiredFields = ['name', 'quantity', 'price'];
    const keys = Object.keys(createProductDto);
    const missingFields = requiredFields.filter(
      (field) => !keys.includes(field),
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Product's Missing required fields: ${missingFields.join(', ')}`,
      );
    }
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }
}
