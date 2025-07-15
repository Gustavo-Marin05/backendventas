import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InvoiceService {

  constructor(private prismaService: PrismaService, private jwrService: JwtService) { }
  async create(dto: CreateInvoiceDto, userId: number) {
    const { customerCi, customerFullName, products } = dto;

    const currentUser = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, idAdmin: true },
    });

    if (!currentUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return this.prismaService.$transaction(async (tx) => {
      // Buscar o crear cliente
      let customer = await tx.customer.findUnique({
        where: { ci: customerCi },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            ci: customerCi,
            fullName: customerFullName,
            userId,
          },
        });
      }

      // Construcción de detalles
      const invoiceDetails = await Promise.all(
        products.map(async (item) => {
          const quantity = item.quantity;

          const product = await tx.product.findFirst({
            where: {
              id: item.productId,
              OR: [
                { userId: userId },
                { userId: currentUser.idAdmin ?? -1 },
              ],
            },
          });

          if (!product) {
            throw new BadRequestException(`No tienes acceso al producto con ID ${item.productId}`);
          }

          if (product.stock < quantity) {
            throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: quantity },
            },
          });

          return {
            productId: item.productId,
            quantity,
            subtotal: product.price * quantity,
          };
        })
      );

      const subtotal = invoiceDetails.reduce((sum, d) => sum + d.subtotal, 0);
      const tax = +(subtotal * 0.13).toFixed(2);
      const total = +(subtotal + tax).toFixed(2);

      // Crear factura
      const invoice = await tx.invoice.create({
        data: {
          customerId: customer.id,
          userId,
          total,
          details: {
            create: invoiceDetails,
          },
        },
        include: {
          details: {
            include: {
              product: true,
            },
          },
        },
      });

      return invoice;
    });
  }

  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
