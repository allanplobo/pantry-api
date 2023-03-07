import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { PantryService } from './pantry.service';

// TODO: study mongo memory server to remove all mocks

describe('PantryService', () => {
  let service: PantryService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PantryService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PantryService>(PantryService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [
        {
          _id: new ObjectId(),
          name: 'Product 1',
          price: 10,
          quantity: 5,
        },
        {
          _id: new ObjectId(),
          name: 'Product 2',
          price: 20,
          quantity: 10,
        },
      ];
      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      expect(await service.getProducts()).toEqual(products);
    });

    it('should throw an HttpException if an error occurs', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

      await expect(service.getProducts()).rejects.toThrow();
    });
  });

  describe('getProductById', () => {
    it('should return the product with the given ID', async () => {
      const id = new ObjectId('123456789asd');
      const product: Product = {
        _id: id,
        name: 'Product 1',
        price: 10,
        quantity: 5,
      };
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(product as any);

      expect(await service.getProductById('123456789asd')).toEqual(product);
    });

    it('should throw a BadRequestException if the ID is invalid', async () => {
      await expect(service.getProductById('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        service.getProductById(new ObjectId().toHexString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createProduct', () => {
    it('should create a new product and return it', async () => {
      const product: CreateProductDto = {
        name: 'Product 1',
        price: 10,
        quantity: 5,
      };

      const newProduct: Product = {
        _id: new ObjectId(),
        name: 'Product 1',
        price: 10,
        quantity: 5,
      };

      jest.spyOn(productRepository, 'create').mockReturnValue(newProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue(newProduct);

      expect(await service.createProduct(product)).toEqual(newProduct);
      expect(productRepository.create).toHaveBeenCalledWith(product);
      expect(productRepository.save).toHaveBeenCalledWith(newProduct);
    });

    it('should throw an HttpException if an error occurs', async () => {
      const newProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 10,
        quantity: 5,
      };
      jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

      await expect(service.createProduct(newProductDto)).rejects.toThrow();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return success message', async () => {
      const productId = new ObjectId().toHexString();
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValueOnce({ affected: 1, raw: {} });

      const result = await service.deleteProduct(productId);

      expect(result).toEqual({
        message: `Product with id ${productId} has been successfully deleted`,
      });
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      const productId = new ObjectId().toHexString();
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValueOnce({ affected: 0, raw: null });

      await expect(service.deleteProduct(productId)).rejects.toThrow(
        NotFoundException,
      );
      expect(productRepository.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product and return it', async () => {
      const productId = new ObjectId();
      const updatedProduct: UpdateProductDto = {
        name: 'New Product Name',
        quantity: 10,
      };
      const existingProduct: Product = {
        _id: productId,
        name: 'Old Product Name',
        quantity: 5,
        description: 'Old Product Name',
        price: 5,
      };

      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(existingProduct);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValueOnce(existingProduct);

      const result = await service.updateProduct(productId, updatedProduct);

      expect(productRepository.findOne).toBeCalledWith({
        where: { _id: productId },
      });
      expect(productRepository.save).toBeCalledWith({
        ...existingProduct,
        ...updatedProduct,
      });
      expect(result).toEqual(existingProduct);
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        service.updateProduct(new ObjectId().toHexString(), {
          name: 'New Product Name',
          quantity: 10,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
