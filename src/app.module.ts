import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ AuthModule, CategoryModule],
  
})
export class AppModule {}
