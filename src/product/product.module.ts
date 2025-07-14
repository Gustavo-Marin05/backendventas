import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [PrismaModule, JwtModule,CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
