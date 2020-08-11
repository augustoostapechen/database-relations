import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    if (!name) {
      throw new AppError('Name is required.');
    }
    if (!price) {
      throw new AppError('Price is required.');
    }

    if (!quantity) {
      throw new AppError('Quantity is required.');
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('Product alredy exists');
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    return product;
  }
}

export default CreateProductService;
