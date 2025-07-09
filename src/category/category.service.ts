import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CategoryService {

  constructor(private prismaService: PrismaService, private jwrService: JwtService) { }

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    try {
      const { name } = createCategoryDto;

      //buscando la categoria si existe
      const findCategory = await this.prismaService.category.findFirst({
        where: {
          name,
          userId
        }
      });
      if (findCategory) throw new BadRequestException('category already exist');

      //creacion de la categoria

      const newCategory = await this.prismaService.category.create({
        data: {
          name,
          userId
        }
      });

      return newCategory;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new Error(error)
    }

  }

  async findAll(userId: number) {
    try {
      const findCategories = await this.prismaService.category.findMany({
        where: {
          userId
        }
      })
      return findCategories;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new Error(error)
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const findCategory = await this.prismaService.category.findFirst({
        where: {
          id,
          userId
        }
      })

      if (!findCategory) throw new BadRequestException('no existe la categoria');

      return findCategory;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new Error(error)
    }
  }



  async update(id: number, updateCategoryDto: UpdateCategoryDto, userId) {
    try {
      // Verificar si la categoría existe
      const category = await this.prismaService.category.findUnique({
        where: { id, userId }
      });

      if (!category)
        throw new BadRequestException(`Category with id ${id} not found`);


      // Actualizar la categoría
      const updatedCategory = await this.prismaService.category.update({
        where: { id, userId },
        data: updateCategoryDto,
      });

      return updatedCategory;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const findCategory = await this.prismaService.category.findFirst({
        where: {
          id, userId
        }
      });

      if (!findCategory) throw new BadRequestException(`Category with id ${id} not found`);

      const category = await this.prismaService.category.delete({
        where: {
          id
        }
      })

      return category;

      
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
