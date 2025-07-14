import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('/category')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  //crear una categoria
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const userId = req.user.id;
    return this.categoryService.create(createCategoryDto, userId);
  }

  //obtener todas las categorias
  @Get()

  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.categoryService.findAll(userId);
  }



  //obtener solo una categoria
  @Get(':id')

  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.categoryService.findOne(+id, userId);
  }

  //editar una categoria
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Request() req) {
    const userId = req.user.id
    return this.categoryService.update(+id, updateCategoryDto, userId);
  }

  //borrar una categoria
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id
    const categoryId = parseInt(id)
    return this.categoryService.remove(categoryId, userId);
  }
}
