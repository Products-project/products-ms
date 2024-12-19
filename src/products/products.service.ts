import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createProductDto: CreateProductDto) {
    return await this.products.create({
      data: createProductDto,
    });
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;

    const totalProducts = await this.products.count({
      where: { active: true },
    });

    const lastPage = Math.ceil(totalProducts / limit);

    if (page > lastPage)
      throw new NotFoundException('There\re not more products');

    return {
      data: await this.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { active: true },
      }),
      meta: {
        total_products: totalProducts,
        current_page: page,
        last_page: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.products.findUnique({
      where: {
        id,
        active: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;
    await this.findOne(id);

    try {
      return await this.products.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal server error', HttpStatus.BAD_GATEWAY);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.products.update({
      where: { id },
      data: { active: false },
    });
  }
}
