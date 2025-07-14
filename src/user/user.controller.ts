import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const idAdmin = req.user.id;
    return this.userService.create(createUserDto, idAdmin);
  }

  @Get()
  findAll(@Request() req) {
    const idAdmin = req.user.id;
    return this.userService.findAll(idAdmin);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const idAdmin = req.user.id;
    return this.userService.findOne(+id, idAdmin);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const idAdmin = req.user.id;
    return this.userService.update(+id, updateUserDto, idAdmin);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const idAdmin = req.user.id;
    return this.userService.remove(+id, idAdmin);
  }
}
