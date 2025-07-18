import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {


  constructor(private prismaService: PrismaService, private jwrService: JwtService, private readonly categoryService: CategoryService) { }

  async create(createProductDto: CreateProductDto, userId: number) {
    try {
      const { name, price, stock, categoryId } = createProductDto;

      //verificar si existe el producto
      const findProduct = await this.prismaService.product.findFirst({
        where: {
          name,
          userId
        }
      });

      if (findProduct) throw new BadRequestException('product already exist');

      //verificar si la categoria existe
      const findCategory = await this.categoryService.findOne(categoryId, userId);

      if (!findCategory) throw new BadRequestException('category doent exist');


      //crear el producto

      const newProduct = await this.prismaService.product.create({
        data: {
          name,
          price,
          stock,
          categoryId,
          userId
        }
      })


      return newProduct;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findAll(userId: number) {
    try {
      const productFound = await this.prismaService.product.findMany({
        where: {
          userId
        },
        select:{
          category:true
        }
      });

      return productFound;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const findProduct = await this.prismaService.product.findFirst({
        where: {
          id,
          userId
        }
      })

      if(!findProduct) throw new BadRequestException('Product not found')
      return findProduct;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    try {
      const { categoryId } = updateProductDto;

      // Verificar si el producto existe y pertenece al usuario
      const product = await this.prismaService.product.findFirst({
        where: { id, userId },
      });

      if (!product) throw new BadRequestException('Product not found');


      // Si se quiere cambiar la categoría, verificar que exista
      if (categoryId) {
        const category = await this.categoryService.findOne(categoryId, userId);
        if (!category) {
          throw new BadRequestException('Category does not exist');
        }
      }

      // Actualizar producto
      const updatedProduct = await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
      });

      return updatedProduct;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const productFind = await this.prismaService.product.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!productFind) throw new BadRequestException('product does not exist');

      //borrar  el producto

      const productDelete = await this.prismaService.product.delete({
        where: {
          id
        }
      })

      return productDelete;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
