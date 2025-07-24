import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class CustomerService {

  constructor(private prismaService: PrismaService, private jwrService: JwtService) { }
  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    try {

      const { fullName, ci } = createCustomerDto
      //buscaremos al customer primero
      const findCustomer = await this.prismaService.customer.findFirst({
        where: {
          fullName,
          userId
        }
      });

      if (findCustomer) throw new BadRequestException(`customer already exist`);

      //creando al nuevo customer

      const newCustomer = await this.prismaService.customer.create({
        data: {
          fullName,
          ci,
          userId
        }
      })

      return newCustomer

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findAll(userId: number, role: Role) {
    try {
      let targetUserIds: number[] = [];

      if (role === 'ADMIN') {
        // ADMIN: obtiene los IDs de usuarios que creó
        const users = await this.prismaService.user.findMany({
          where: { idAdmin: userId },
          select: { id: true },
        });

        targetUserIds = users.map(user => user.id);
      } else {
        // USER: busca su admin y obtiene los usuarios del mismo admin
        const user = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: { idAdmin: true },
        });

        if (!user?.idAdmin) {
          // Si no tiene admin, solo ve sus propios customers
          return this.prismaService.customer.findMany({
            where: { userId },
          });
        }

        const users = await this.prismaService.user.findMany({
          where: { idAdmin: user.idAdmin },
          select: { id: true },
        });

        targetUserIds = users.map(user => user.id);
      }

      // En ambos casos, devolver los customers de los userIds recopilados
      return this.prismaService.customer.findMany({
        where: {
          userId: { in: targetUserIds },
        },
      });

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error?.message || 'Error fetching customers');
    }
  }


  async findOne(id: number, userId: number) {
    try {
      const customer = await this.prismaService.customer.findFirst({
        where: {
          id,
          userId
        }
      })

      if (!customer) throw new BadRequestException(`customer not found`);

      return customer;

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }

  async findInvoiceCustomer(id: number) {

    try {
      const invoices = await this.prismaService.invoice.findMany({
        where: {
          customerId: id
        },
        include: {
          customer: true,
          details: true
        }
      })

      if (!invoices) throw new BadRequestException(`invoices not found`);

      return invoices

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }

  }



  async findByCi(ci: string) {
    const customer = await this.prismaService.customer.findFirst({ where: { ci } });
    if (!customer) {
      console.log('No se encontró el cliente');
      throw new BadRequestException("customer not found");
    }
    return customer;
  }

}
