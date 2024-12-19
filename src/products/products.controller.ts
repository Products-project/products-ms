import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create' })
  async create(@Payload() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find_all' })
  async findAll(@Payload() pagination: PaginationDto) {
    return await this.productsService.findAll(pagination);
  }

  @MessagePattern({ cmd: 'find_one' })
  async findOne(@Payload('id') id: number) {
    return await this.productsService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern({ cmd: 'delete' })
  remove(@Payload('id') id: number) {
    return this.productsService.remove(+id);
  }
}
