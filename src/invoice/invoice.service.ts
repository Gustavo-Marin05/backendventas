import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class InvoiceService {

  constructor(private prismaService: PrismaService, private jwrService: JwtService) { }
  async create(dto: CreateInvoiceDto, userId: number) {
    const { customerCi, customerFullName, products } = dto;

    console.log("📥 DTO recibido:", dto);
    console.log("👤 Usuario ID:", userId);


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


  async generatePdf(invoiceId: number, res: Response) {
    const invoice = await this.prismaService.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        user: true,
        details: {
          include: { product: true },
        },
      },
    });

    if (!invoice) {
      throw new BadRequestException('Factura no encontrada');
    }

    const doc = new PDFDocument();

    // Stream the PDF to the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=factura-${invoice.id}.pdf`);
    doc.pipe(res);

    // Título
    doc.fontSize(18).text('FACTURA', { align: 'center' });
    doc.moveDown();

    // Datos del cliente
    doc.fontSize(12).text(`Cliente: ${invoice.customer.fullName || 'Anónimo'}`);
    doc.text(`CI/NIT: ${invoice.customer.ci}`);
    doc.text(`Fecha: ${invoice.date.toLocaleDateString()}`);
    doc.moveDown();

    // Tabla de productos
    doc.text('Productos:', { underline: true });
    doc.moveDown(0.5);

    doc.text('Producto          Cantidad     Precio Unitario     Subtotal');
    doc.moveDown(0.3);
    doc.text('-------------------------------------------------------------');

    invoice.details.forEach((detail) => {
      const { product, quantity, subtotal } = detail;
      doc.text(
        `${product.name.padEnd(18)} ${quantity.toString().padEnd(10)} Bs ${product.price.toFixed(2).padEnd(17)} Bs ${subtotal.toFixed(2)}`
      );
    });

    doc.moveDown();
    const subtotal = invoice.details.reduce((sum, d) => sum + d.subtotal, 0);
    const tax = +(subtotal * 0.13).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    doc.text('-------------------------------------------------------------');
    doc.text(`Subtotal: Bs ${subtotal.toFixed(2)}`);
    doc.text(`IVA (13%): Bs ${tax.toFixed(2)}`);
    doc.text(`Total: Bs ${total.toFixed(2)}`, { bold: true });
    doc.end();
  }




  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }


}
