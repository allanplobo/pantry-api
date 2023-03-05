import { Test, TestingModule } from '@nestjs/testing';
import { PantryController } from './pantry.controller';
import { PantryService } from '../services/pantry.service';
import { Product } from '../entities/product.entity';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services/logger.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('PantryController', () => {
  let controller: PantryController;
  let service: PantryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PantryController],
      providers: [
        {
          provide: PantryService,
          useValue: {
            getProducts: jest.fn(),
            getProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PantryController>(PantryController);
    service = module.get<PantryService>(PantryService);
    Logger.overrideLogger([]);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const expectedProducts: Product[] = [
        {
          _id: '123456789012',
          name: 'Test Product 1',
          description: 'Test description 1',
          price: 10,
          quantity: 20,
        },
        {
          _id: '123456789013',
          name: 'Test Product 2',
          description: 'Test description 2',
          price: 5,
          quantity: 15,
        },
      ];

      jest.spyOn(service, 'getProducts').mockResolvedValue(expectedProducts);

      const products = await controller.getProducts();

      expect(products).toBe(expectedProducts);
      expect(service.getProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    const productId = '123456789012';

    it('should return a product with the specified ID', async () => {
      const expectedProduct: Product = {
        _id: productId,
        name: 'Test Product 1',
        description: 'Test description 1',
        price: 10,
        quantity: 20,
      };

      jest.spyOn(service, 'getProductById').mockResolvedValue(expectedProduct);

      const product = await controller.getProductById(productId);

      expect(product).toBe(expectedProduct);
      expect(service.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should throw a NotFoundException if no product with the specified ID is found', async () => {
      jest
        .spyOn(service, 'getProductById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getProductById(productId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getProductById).toHaveBeenCalledWith(productId);
    });

    it('should throw a BadRequestException if an invalid ID is provided', async () => {
      jest
        .spyOn(service, 'getProductById')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.getProductById('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product and return it', async () => {
      const mockProduct: CreateProductDto = {
        name: 'Test Product',
        description: 'Test product description',
        quantity: 10,
        price: 10,
      };
      const expectedProduct: Product = {
        _id: 'test-id',
        name: 'Test Product',
        description: 'Test product description',
        quantity: 10,
        price: 10,
      };
      jest.spyOn(service, 'createProduct').mockResolvedValue(expectedProduct);

      const result = await controller.createProduct(mockProduct);

      expect(service.createProduct).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(expectedProduct);
    });

    it('should throw a BadRequestException if the product is missing required fields', async () => {
      const mockProduct: any = {
        name: 'Test Product',
        description: 'Test product description',
      };
      const expectedError = new BadRequestException('Missing required fields');

      try {
        await controller.createProduct(mockProduct);
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

  describe('deleteProduct', () => {
    const productId = '123';

    it('should call service.deleteProduct with the correct id', async () => {
      await controller.deleteProduct(productId);
      expect(service.deleteProduct).toHaveBeenCalledWith(productId);
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      jest
        .spyOn(service, 'deleteProduct')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.deleteProduct(productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException if an error occurs while deleting the product', async () => {
      jest
        .spyOn(service, 'deleteProduct')
        .mockRejectedValue(new InternalServerErrorException());
      await expect(controller.deleteProduct(productId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return a success message if the product is successfully deleted', async () => {
      const productId = 'valid-id';
      jest
        .spyOn(service, 'deleteProduct')
        .mockResolvedValue({ message: 'Product successfully deleted' });
      const result = await controller.deleteProduct(productId);
      expect(result).toEqual({ message: 'Product successfully deleted' });
    });
  });

  describe('updateProduct', () => {
    const productId = 'valid-product-id';
    const updateProductDto: UpdateProductDto = {
      name: 'new-product-name',
      quantity: 5,
      price: 5,
    };

    it('should return the updated product if the product is successfully updated', async () => {
      const updatedProduct = {
        id: productId,
        name: updateProductDto.name,
        quantity: updateProductDto.quantity,
        price: updateProductDto.price,
      };
      jest.spyOn(service, 'updateProduct').mockResolvedValue(updatedProduct);
      const result = await controller.updateProduct(
        productId,
        updateProductDto,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw a NotFoundException if an invalid ID is provided', async () => {
      jest
        .spyOn(service, 'updateProduct')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.updateProduct('invalid-id', updateProductDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw a BadRequestException if an invalid updateProductDto is provided', async () => {
      jest
        .spyOn(service, 'updateProduct')
        .mockRejectedValue(new BadRequestException());
      await expect(
        controller.updateProduct(productId, { quantity: -1 }),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
