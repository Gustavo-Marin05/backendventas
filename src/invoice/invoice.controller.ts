import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller('invoice')
@UseGuards(AuthGuard, RolesGuard)
@Roles('USER')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  @Roles('USER')
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req) {
    const userId = req.user.id;
    return this.invoiceService.create(createInvoiceDto, userId);
  }
  @Get(':id/pdf')
  @Roles('ADMIN', 'USER')
  generatePdf(@Param('id') id: string, @Res() res: Response) {
    return this.invoiceService.generatePdf(+id, res);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(+id);
  }

  //esta considerado cambiar los roles debido a errores

}
