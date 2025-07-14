import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/create-auth.dto';
import { compare, encrypt } from './libs/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService, private jwrService: JwtService) { }

    //parte del login de autentificacion 
    async loginService(email: string, password: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { email }
            });

            if (!user) throw new BadRequestException('email o contraseña inválidos');

            const isMatch = await compare(password, user.password);
            if (!isMatch) throw new BadRequestException('contraseña incorrecta');

            const payload = {
                id: user.id,
                email: user.email,
                role: user.role, // 👈 Aseguramos incluir el rol
            };

            const acces_token = await this.jwrService.signAsync(payload);
            return { acces_token };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new Error(error);
        }
    }



    //registro de los usuarios 
    async registerService(userdto: RegisterUserDto) {
        try {
            const { email, password, fullName, ci, role } = userdto;

            const userFound = await this.prismaService.user.findUnique({
                where: { email }
            });

            if (userFound) throw new BadRequestException('el usuario ya existe');

            const passwordHash = await encrypt(password);

            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: passwordHash,
                    fullName,
                    ci,
                    role: role, 
                }
            });

            const payload = {
                id: user.id,
                email: user.email,
                role: user.role, // 👈 Incluido explícitamente
            };

            const acces_token = await this.jwrService.signAsync(payload);

            return {
                acces_token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    ci: user.ci,
                    role: user.role,
                },
            };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new Error(error);
        }
    }


    //no devuelve todos los usuarios
    async getUsers() {
        try {
            const users = await this.prismaService.user.findMany();
            return users;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error
            }
            throw new Error(error)
        }
    }
}