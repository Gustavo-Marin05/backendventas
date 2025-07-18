import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product')
@UseGuards(AuthGuard,RolesGuard)
@Roles('ADMIN','USER')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles('ADMIN')
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const userId = req.user.id;
    return this.productService.create(createProductDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.productService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.productService.findOne(+id, userId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@Request() req) {
    const userId = req.user.id
    return this.productService.update(+id, updateProductDto,userId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string,@Request() req) {
    const userId = req.user.id
    return this.productService.remove(+id,userId);
  }
}
