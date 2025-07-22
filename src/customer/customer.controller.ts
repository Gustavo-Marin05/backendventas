import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('customer')
@UseGuards(AuthGuard, RolesGuard)
@Roles('USER', 'ADMIN')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  @Roles('USER')
  create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
    const userId = req.user.id
    return this.customerService.create(createCustomerDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const user = req.user
    return this.customerService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id
    return this.customerService.findOne(+id, userId);
  }

  @Get('/invoices/:id')
  findInvoice(@Param('id') id:string){
    return this.customerService.findInvoiceCustomer(+id)
  }


}
