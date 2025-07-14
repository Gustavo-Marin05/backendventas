import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { encrypt } from 'src/auth/libs/bcrypt';

@Injectable()
export class UserService {

  constructor(private prismaService: PrismaService, private jwrService: JwtService) { }
  async create(createUserDto: CreateUserDto, idAdmin: number) {
    try {

      //buscando si existe el usuario 
      const { email, fullName, ci, password, role } = createUserDto;
      const findUser = await this.prismaService.user.findFirst({
        where: {
          email,
          role: 'USER'
        }
      });
      if (findUser) throw new BadRequestException('user already exist');

      //encriptar la contraceña
      const passwordHash = await encrypt(password);

      //creando al usuario

      const newUser = await this.prismaService.user.create({
        data: {
          email, fullName,
          ci,
          password: passwordHash,
          role: 'USER',
          idAdmin
        }

      });

      return newUser;


    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findAll(idAdmin: number) {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          idAdmin
        }
      })
      return users;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findOne(id: number, idAdmin: number) {
    try {

      const user = await this.prismaService.user.findFirst({
        where: {
          id,
          idAdmin,

        }
      });


      if (!user) throw new BadRequestException('usuario no encontrado');

      return user;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, idAdmin: number) {

    try {
      //buscara primero el usuario
      await this.findOne(id, idAdmin)

      const updateuser = await this.prismaService.user.update({
        where: {
          id,
          idAdmin
        },
        data: updateUserDto
      })

      return updateuser

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async remove(id: number,idAdmin:number) {
    try {
      //encontrara al ususrio si es que existe
      await this.findOne(id,idAdmin)

      const user= await this.prismaService.user.delete({
        where:{
          id
        }
      })
      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
