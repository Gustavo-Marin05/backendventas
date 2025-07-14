import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {


    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsInt()
    @IsPositive()
    stock: number;

    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @IsOptional()
    @IsInt()
    userId?: number;

    @IsOptional()
    @IsInt()
    companyId?: number;
}
