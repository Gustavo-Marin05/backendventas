import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';


export class RegisterUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;

  @IsString()
  @Length(7, 12, { message: 'El CI debe tener entre 7 y 12 caracteres' })
  ci: string;

}
