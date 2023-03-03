import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class PantryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      throw new HttpException(
        `Error while getting products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductById(id: string): Promise<Product> {
    if (!ObjectID.isValid(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const objectIDToSearch = new ObjectID(id);
    const product = await this.productRepository.findOne({
      where: { _id: objectIDToSearch },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
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
      throw new BadRequestException(missingFieldsMessage);
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.getProductById(id);
      const { name, description, price, quantity } = updateProductDto;
      if (!name && !description && !price && !quantity) {
        throw new BadRequestException(
          'At least one field must be provided to update the product',
        );
      }
      const updatedProduct = {
        ...product,
        ...updateProductDto,
      };
      return this.productRepository.save(updatedProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Error while updating the product with id ${id}: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const result = await this.productRepository.delete(productId);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    return {
      message: `Product with id ${productId} has been successfully deleted`,
    };
  }
}
