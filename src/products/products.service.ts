import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.products.create({
        data: createProductDto,
      });
    } catch (error) {
      throw new RpcException({
        message: `Internal server error ${error}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;

    const totalProducts = await this.products.count({
      where: { active: true },
    });

    const lastPage = Math.ceil(totalProducts / limit);

    if (page > lastPage)
      throw new RpcException({
        message: 'There\re not more products',
        status: HttpStatus.NOT_FOUND,
      });

    try {
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
    } catch (error) {
      throw new RpcException({
        message: `Internal server error ${error}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(id: number) {
    const product = await this.products.findUnique({
      where: {
        id,
        active: true,
      },
    });
    if (!product)
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND,
      });

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;
    await this.findOne(id);

    try {
      const updatedProduct = await this.products.update({
        where: { id },
        data,
      });

      if (!updatedProduct) {
        throw new RpcException({
          message: `Error whent trying to update product`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      return {
        status: 200,
        message: 'Product updated',
        data: updatedProduct,
      };
    } catch (error) {
      throw new RpcException({
        message: `Internal server error ${error}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      const deletedProduct = await this.products.update({
        where: { id },
        data: { active: false },
      });

      if (!deletedProduct) {
        throw new RpcException({
          message: `Error whent trying to delete product`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      return {
        status: 200,
        message: 'Product deleted',
        data: deletedProduct,
      };
    } catch (error) {
      throw new RpcException({
        message: `Internal server error ${error}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
