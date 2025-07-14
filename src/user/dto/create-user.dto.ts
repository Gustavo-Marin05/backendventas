import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    ci: string;

    @IsString()
    @MinLength(5)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

}
